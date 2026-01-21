'use client';

import React from "react";

import { usePricingTable } from "autumn-js/react";
import { useCustomer } from "@/hooks/useAutumnCustomer";
import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Check, Loader2 } from "lucide-react";
import AttachDialog from "@/components/autumn/attach-dialog";
import { getPricingTableContent } from "@/lib/autumn/pricing-table-content";
import { Product, ProductItem } from "autumn-js";
export default function PricingTable({
  productDetails,
}: {
  productDetails?: any;
}) {
  const { attach } = useCustomer();
  const [isAnnual, setIsAnnual] = useState(false);
  const { products, isLoading, error } = usePricingTable({ productDetails });

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center min-h-[300px]">
        <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
      </div>
    );
  }

  const isDev = process.env.NODE_ENV === 'development';

  // Mock data for development mode fallback
  const mockProducts = [
    {
      id: "free",
      name: "Free",
      scenario: "new",
      properties: { is_free: true, interval_group: "month" },
      display: {
        name: "Free",
        description: "Perfect for trying out our service",
        button_text: "Start free",
      },
      items: [
        { display: { primary_text: "Free", secondary_text: "No credit card required" } },
        { display: { primary_text: "10 messages per month", secondary_text: "AI-powered chat responses" } },
        { display: { primary_text: "Community support", secondary_text: "Get help from our community" } },
        { display: { primary_text: "Basic features", secondary_text: "Essential tools to get started" } }
      ]
    },
    {
      id: "pro",
      name: "Pro",
      scenario: "new",
      properties: { is_free: false, interval_group: "month" },
      display: {
        name: "Pro",
        description: "For all your messaging needs",
        recommend_text: "Most Popular",
        button_text: "Get started",
      },
      items: [
        { display: { primary_text: "$499/month", secondary_text: "billed monthly" } },
        { display: { primary_text: "100 messages per month", secondary_text: "AI-powered chat responses" } },
        { display: { primary_text: "Premium support", secondary_text: "Get help from our team" } },
        { display: { primary_text: "Priority access", secondary_text: "Be first to try new features" } }
      ]
    },
    {
      id: "enterprise",
      name: "Enterprise",
      scenario: "new",
      properties: { is_free: false, interval_group: "month" },
      display: {
        name: "Enterprise",
        description: "For large teams",
        button_text: "Contact sales",
      },
      items: [
        { display: { primary_text: "Custom", secondary_text: "Contact us for pricing" } },
        { display: { primary_text: "Unlimited messages", secondary_text: "Scale as you grow" } },
        { display: { primary_text: "Custom features", secondary_text: "Built for your needs" } },
        { display: { primary_text: "Dedicated support", secondary_text: "24/7 priority help" } }
      ]
    }
  ];

  // Map products or fallback to mock data in dev
  const displayProducts = error && isDev ? mockProducts : products;

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center min-h-[300px]">
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error && !isDev) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500 mb-2">Something went wrong while loading plans...</p>
        <p className="text-sm text-gray-400">Please try again later or contact support.</p>
      </div>
    );
  }

  const intervals = Array.from(
    new Set(
      products?.map((p) => p.properties?.interval_group).filter((i) => !!i)
    )
  );

  const multiInterval = intervals.length > 1;

  const intervalFilter = (product: any) => {
    if (!product.properties?.interval_group) {
      return true;
    }

    if (multiInterval) {
      if (isAnnual) {
        return product.properties?.interval_group === "year";
      } else {
        return product.properties?.interval_group === "month";
      }
    }

    return true;
  };

  return (
    <div className={cn("root")}>
      {displayProducts && (
        <PricingTableContainer
          products={displayProducts as any}
          isAnnualToggle={isAnnual}
          setIsAnnualToggle={setIsAnnual}
          multiInterval={multiInterval}
        >
          {displayProducts.filter(intervalFilter).map((product, index) => (
            <PricingCard
              key={index}
              productId={product.id}
              buttonProps={{
                disabled:
                  product.scenario === "active" ||
                  product.scenario === "scheduled",

                onClick: async () => {
                  if (product.id && !isDev) {
                    await attach({
                      productId: product.id,
                      dialog: AttachDialog,
                      returnUrl: window.location.origin + '/dashboard',
                      successUrl: window.location.origin + '/dashboard',
                      cancelUrl: window.location.origin + '/pricing',
                    });
                  } else {
                    // Mock behavior for dev
                    console.log('[DEV] Mock redirect to register for:', product.id);
                    window.location.href = '/register';
                  }
                },
              }}
            />
          ))}
        </PricingTableContainer>
      )}
    </div>
  );
}

const PricingTableContext = createContext<{
  isAnnualToggle: boolean;
  setIsAnnualToggle: (isAnnual: boolean) => void;
  products: Product[];
  showFeatures: boolean;
}>({
  isAnnualToggle: false,
  setIsAnnualToggle: () => { },
  products: [],
  showFeatures: true,
});

export const usePricingTableContext = (componentName: string) => {
  const context = useContext(PricingTableContext);

  if (context === undefined) {
    throw new Error(`${componentName} must be used within <PricingTable />`);
  }

  return context;
};

export const PricingTableContainer = ({
  children,
  products,
  showFeatures = true,
  className,
  isAnnualToggle,
  setIsAnnualToggle,
  multiInterval,
}: {
  children?: React.ReactNode;
  products?: Product[];
  showFeatures?: boolean;
  className?: string;
  isAnnualToggle: boolean;
  setIsAnnualToggle: (isAnnual: boolean) => void;
  multiInterval: boolean;
}) => {
  if (!products) {
    throw new Error("products is required in <PricingTable />");
  }

  if (products.length === 0) {
    return <></>;
  }

  const hasRecommended = products?.some((p) => p.display?.recommend_text);
  return (
    <PricingTableContext.Provider
      value={{ isAnnualToggle, setIsAnnualToggle, products, showFeatures }}
    >
      <div
        className={cn(
          "flex items-center flex-col",
          hasRecommended && "!py-10"
        )}
      >
        {multiInterval && (
          <div
            className={cn(
              products.some((p) => p.display?.recommend_text) && "mb-8"
            )}
          >
            <AnnualSwitch
              isAnnualToggle={isAnnualToggle}
              setIsAnnualToggle={setIsAnnualToggle}
            />
          </div>
        )}
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] w-full gap-2",
            className
          )}
        >
          {children}
        </div>
      </div>
    </PricingTableContext.Provider>
  );
};

interface PricingCardProps {
  productId: string;
  showFeatures?: boolean;
  className?: string;
  onButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  buttonProps?: React.ComponentProps<"button">;
}

export const PricingCard = ({
  productId,
  className,
  buttonProps,
}: PricingCardProps) => {
  const { products, showFeatures } = usePricingTableContext("PricingCard");

  const product = products.find((p) => p.id === productId);

  if (!product) {
    throw new Error(`Product with id ${productId} not found`);
  }

  const { name, display: productDisplay, items } = product;

  const { buttonText } = getPricingTableContent(product);
  const isRecommended = productDisplay?.recommend_text ? true : false;
  const mainPriceDisplay = product.properties?.is_free
    ? {
      primary_text: "Free",
    }
    : product.items[0].display;

  const featureItems = product.properties?.is_free
    ? product.items
    : product.items.slice(1);

  return (
    <div
      className={cn(
        "relative w-full h-full py-6 text-foreground border rounded-lg shadow-sm max-w-xl",
        isRecommended &&
        "lg:-translate-y-6 lg:shadow-lg dark:shadow-zinc-800/80 lg:h-[calc(100%+48px)] bg-secondary/40",
        className
      )}
    >
      {productDisplay?.recommend_text && (
        <RecommendedBadge recommended={productDisplay?.recommend_text} />
      )}
      <div
        className={cn(
          "flex flex-col h-full flex-grow",
          isRecommended && "lg:translate-y-6"
        )}
      >
        <div className="h-full">
          <div className="flex flex-col">
            <div className="pb-4">
              <h2 className="text-2xl font-semibold px-6 truncate">
                {productDisplay?.name || name}
              </h2>
              {productDisplay?.description && (
                <div className="text-sm text-muted-foreground px-6 h-8">
                  <p className="line-clamp-2">
                    {productDisplay?.description}
                  </p>
                </div>
              )}
            </div>
            <div className="mb-2">
              <h3 className="font-semibold h-16 flex px-6 items-center border-y mb-4 bg-secondary/40">
                <div className="line-clamp-2">
                  {mainPriceDisplay?.primary_text}{" "}
                  {mainPriceDisplay?.secondary_text && (
                    <span className="font-normal text-muted-foreground mt-1">
                      {mainPriceDisplay?.secondary_text}
                    </span>
                  )}
                </div>
              </h3>
            </div>
          </div>
          {showFeatures && featureItems.length > 0 && (
            <div className="flex-grow px-6 mb-6">
              <PricingFeatureList
                items={featureItems}
                showIcon={true}
                everythingFrom={product.display?.everything_from}
              />
            </div>
          )}
        </div>
        <div
          className={cn(" px-6 ", isRecommended && "lg:-translate-y-12")}
        >
          <PricingCardButton
            recommended={productDisplay?.recommend_text ? true : false}
            {...buttonProps}
          >
            {productDisplay?.button_text || buttonText}
          </PricingCardButton>
        </div>
      </div>
    </div>
  );
};

// Pricing Feature List
export const PricingFeatureList = ({
  items,
  showIcon = true,
  everythingFrom,
  className,
}: {
  items: ProductItem[];
  showIcon?: boolean;
  everythingFrom?: string;
  className?: string;
}) => {
  return (
    <div className={cn("flex-grow", className)}>
      {everythingFrom && (
        <p className="text-sm mb-4">
          Everything from {everythingFrom}, plus:
        </p>
      )}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-2 text-sm"
          >
            {showIcon && (
              <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            )}
            <div className="flex flex-col">
              <span>{item.display?.primary_text}</span>
              {item.display?.secondary_text && (
                <span className="text-sm text-muted-foreground">
                  {item.display?.secondary_text}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pricing Card Button
export interface PricingCardButtonProps extends React.ComponentProps<"button"> {
  recommended?: boolean;
  buttonUrl?: string;
}

export const PricingCardButton = React.forwardRef<
  HTMLButtonElement,
  PricingCardButtonProps
>(({ recommended, children, className, onClick, ...props }, ref) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    try {
      await onClick?.(e);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={cn(
        "w-full py-3 px-4 group overflow-hidden relative transition-all duration-300 border rounded-[10px] inline-flex items-center justify-center whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50",
        recommended ? "btn-ainet-mint" : "btn-ainet-default",
        className
      )}
      {...props}
      data-primary={recommended ? "true" : "false"}
      ref={ref}
      disabled={loading || props.disabled}
      onClick={handleClick}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Loading checkout...</span>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <span>{children}</span>
          <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      )}
    </button>
  );
});
PricingCardButton.displayName = "PricingCardButton";

// Annual Switch
export const AnnualSwitch = ({
  isAnnualToggle,
  setIsAnnualToggle,
}: {
  isAnnualToggle: boolean;
  setIsAnnualToggle: (isAnnual: boolean) => void;
}) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-sm text-muted-foreground">Monthly</span>
      <Switch
        id="annual-billing"
        checked={isAnnualToggle}
        onCheckedChange={setIsAnnualToggle}
      />
      <span className="text-sm text-muted-foreground">Annual</span>
    </div>
  );
};

export const RecommendedBadge = ({ recommended }: { recommended: string }) => {
  return (
    <div className="bg-black absolute border text-white text-sm font-medium lg:rounded-full px-3 lg:py-0.5 lg:top-4 lg:right-4 top-[-1px] right-[-1px] rounded-bl-lg">
      {recommended}
    </div>
  );
};
