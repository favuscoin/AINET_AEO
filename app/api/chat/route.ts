import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { Autumn } from 'autumn-js';
import { db } from '@/lib/db';
import { conversations, messages } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import {
  AuthenticationError,
  InsufficientCreditsError,
  ValidationError,
  DatabaseError,
  ExternalServiceError,
  handleApiError
} from '@/lib/api-errors';
import {
  FEATURE_ID_MESSAGES,
  CREDITS_PER_MESSAGE,
  ERROR_MESSAGES,
  ROLE_USER,
  ROLE_ASSISTANT,
  UI_LIMITS
} from '@/config/constants';
import { scrapeCompanyInfo } from '@/lib/scrape-utils';

// Force dynamic rendering - don't pre-render during build
export const dynamic = 'force-dynamic';

const autumn = new Autumn({
  secretKey: process.env.AUTUMN_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    // Get the session
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      console.error('No session found in chat API');
      throw new AuthenticationError('Please log in to use the chat');
    }

    console.log('Chat API - User:', sessionResponse.user.id);

    const { message, conversationId } = await request.json();

    if (!message || typeof message !== 'string') {
      throw new ValidationError('Invalid message format', {
        message: 'Message must be a non-empty string'
      });
    }

    // Check if user has access to use the chat
    const isDev = process.env.NODE_ENV === 'development';

    try {
      console.log('Checking access for:', {
        userId: sessionResponse.user.id,
        featureId: 'messages',
      });

      let allowed = true;
      let balance = 1000;

      if (!isDev || (process.env.AUTUMN_SECRET_KEY && !process.env.AUTUMN_SECRET_KEY.includes('1234'))) {
        try {
          const access = await autumn.check({
            customer_id: sessionResponse.user.id,
            feature_id: FEATURE_ID_MESSAGES,
          });

          console.log('Access check result:', access);
          allowed = access.data?.allowed || false;
          balance = access.data?.balance || 0;
        } catch (err) {
          console.error('Autumn check failed:', err);
          if (isDev) {
            console.log('[DEV] Bypassing failed Autumn check');
            allowed = true;
            balance = 1000;
          } else {
            throw err;
          }
        }
      } else {
        console.log('[DEV] Bypassing Autumn check (using mock balance)');
      }

      if (!allowed) {
        console.log('Access denied - no credits remaining');
        throw new InsufficientCreditsError(
          ERROR_MESSAGES.NO_CREDITS_REMAINING,
          CREDITS_PER_MESSAGE,
          balance
        );
      }
    } catch (err) {
      console.error('Failed to check access:', err);
      if (err instanceof InsufficientCreditsError) {
        throw err; // Re-throw our custom errors
      }
      throw new ExternalServiceError('Unable to verify credits. Please try again', 'autumn');
    }

    // Track API usage with Autumn
    if (!isDev || (process.env.AUTUMN_SECRET_KEY && !process.env.AUTUMN_SECRET_KEY.includes('1234'))) {
      try {
        await autumn.track({
          customer_id: sessionResponse.user.id,
          feature_id: FEATURE_ID_MESSAGES,
          value: CREDITS_PER_MESSAGE,
        });
      } catch (err) {
        console.error('Failed to track usage:', err);
        if (!isDev) {
          throw new ExternalServiceError('Unable to process credit usage. Please try again', 'autumn');
        }
      }
    } else {
      console.log('[DEV] Bypassing Autumn track');
    }

    // Get or create conversation
    let currentConversation;

    if (conversationId) {
      // Find existing conversation
      const existingConversation = await db.query.conversations.findFirst({
        where: and(
          eq(conversations.id, conversationId),
          eq(conversations.userId, sessionResponse.user.id)
        ),
      });

      if (existingConversation) {
        currentConversation = existingConversation;
        // Update last message timestamp
        await db
          .update(conversations)
          .set({ lastMessageAt: new Date() })
          .where(eq(conversations.id, conversationId));
      }
    }

    if (!currentConversation) {
      // Create new conversation
      const [newConversation] = await db
        .insert(conversations)
        .values({
          userId: sessionResponse.user.id,
          title: message.substring(0, UI_LIMITS.TITLE_MAX_LENGTH) + (message.length > UI_LIMITS.TITLE_MAX_LENGTH ? '...' : ''),
          lastMessageAt: new Date(),
        })
        .returning();

      currentConversation = newConversation;
    }

    // Store user message
    const [userMessage] = await db
      .insert(messages)
      .values({
        conversationId: currentConversation.id,
        userId: sessionResponse.user.id,
        role: ROLE_USER,
        content: message,
      })
      .returning();

    // Detect URLs in the message
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+)(?:\/[^\s]*)?/gi;
    const urlMatches = message.match(urlRegex);
    const detectedUrls = urlMatches ? [...new Set(urlMatches)].slice(0, 2) : []; // Max 2 URLs

    // Scrape detected URLs
    let scrapedData = '';
    if (detectedUrls.length > 0) {
      console.log('[Chat] Detected URLs:', detectedUrls);

      for (const url of detectedUrls) {
        try {
          console.log('[Chat] Scraping URL:', url);
          const company = await scrapeCompanyInfo(url);

          scrapedData += `\n\n---\nWebsite Analysis for ${url}:\n`;
          scrapedData += `- Title: ${company.name}\n`;
          scrapedData += `- Description: ${company.description}\n`;
          scrapedData += `- Industry: ${company.industry}\n`;

          if (company.scrapedData) {
            if (company.scrapedData.keywords?.length > 0) {
              scrapedData += `- Keywords: ${company.scrapedData.keywords.join(', ')}\n`;
            }
            if (company.scrapedData.mainProducts?.length > 0) {
              scrapedData += `- Main Products: ${company.scrapedData.mainProducts.join(', ')}\n`;
            }
            if (company.scrapedData.competitors?.length > 0) {
              scrapedData += `- Competitors: ${company.scrapedData.competitors.join(', ')}\n`;
            }
            // Include a snippet of the content for analysis
            const contentSnippet = company.scrapedData.mainContent.substring(0, 1500);
            scrapedData += `- Content Preview: ${contentSnippet}...\n`;
          }
          scrapedData += `---\n`;
        } catch (error) {
          console.error('[Chat] Error scraping URL:', url, error);
          scrapedData += `\n\n---\nNote: Unable to scrape ${url}. Proceeding with analysis based on URL only.\n---\n`;
        }
      }
    }

    // Get conversation history for context
    const conversationHistory = await db.query.messages.findMany({
      where: eq(messages.conversationId, currentConversation.id),
      orderBy: [messages.createdAt],
      limit: 20, // Last 20 messages for context
    });

    // Build messages array for AI with conversation history
    const { streamText } = await import('ai');
    const { openai } = await import('@ai-sdk/openai');
    const { AEO_SYSTEM_PROMPT } = await import('@/lib/aeo-system-prompt');

    const aiMessages = [
      { role: 'system' as const, content: AEO_SYSTEM_PROMPT },
      ...conversationHistory.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    // Add scraped website data to context if available
    if (scrapedData) {
      aiMessages.push({
        role: 'system' as const,
        content: `The user mentioned website(s) in their message. Here is the scraped data from those websites:\n${scrapedData}\n\nUse this real data to provide specific, actionable AEO recommendations.`
      });
    }

    // Stream AI response
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages: aiMessages,
      temperature: 0.7,
      maxTokens: 2000,
    });

    // Collect the streamed response
    let fullResponse = '';
    for await (const chunk of result.textStream) {
      fullResponse += chunk;
    }

    // Store AI response
    const [aiMessage] = await db
      .insert(messages)
      .values({
        conversationId: currentConversation.id,
        userId: sessionResponse.user.id,
        role: ROLE_ASSISTANT,
        content: fullResponse,
        tokenCount: fullResponse.length, // Approximate token count
      })
      .returning();


    // Get remaining credits from Autumn
    let remainingCredits = 0;
    try {
      const usage = await autumn.check({
        customer_id: sessionResponse.user.id,
        feature_id: FEATURE_ID_MESSAGES,
      });
      remainingCredits = usage.data?.balance || 0;
    } catch (err) {
      console.error('Failed to get remaining credits:', err);
    }

    return NextResponse.json({
      response: fullResponse,
      remainingCredits,
      creditsUsed: CREDITS_PER_MESSAGE,
      conversationId: currentConversation.id,
      messageId: aiMessage.id,
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return handleApiError(error);
  }
}

// GET endpoint to fetch conversation history
export async function GET(request: NextRequest) {
  try {
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      // Get specific conversation with messages
      const conversation = await db.query.conversations.findFirst({
        where: and(
          eq(conversations.id, conversationId),
          eq(conversations.userId, sessionResponse.user.id)
        ),
        with: {
          messages: {
            orderBy: [messages.createdAt],
          },
        },
      });

      if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }

      return NextResponse.json(conversation);
    } else {
      // Get all conversations for the user
      const userConversations = await db.query.conversations.findMany({
        where: eq(conversations.userId, sessionResponse.user.id),
        orderBy: [desc(conversations.lastMessageAt)],
        with: {
          messages: {
            limit: 1,
            orderBy: [desc(messages.createdAt)],
          },
        },
      });

      return NextResponse.json(userConversations);
    }
  } catch (error: any) {
    console.error('Chat GET error:', error);
    return handleApiError(error);
  }
}
