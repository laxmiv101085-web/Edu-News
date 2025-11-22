import { NextPageContext } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/feedback/EmptyState";

interface ErrorProps {
  statusCode?: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

function Error({ statusCode, hasGetInitialPropsRun, err }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    if (!hasGetInitialPropsRun && err) {
      // Log the error to an error reporting service here
      console.error("Error:", err);
    }
  }, [hasGetInitialPropsRun, err]);

  const getErrorMessage = () => {
    if (statusCode === 404) {
      return {
        title: "Page Not Found",
        description: "The page you're looking for doesn't exist or has been moved.",
      };
    }
    if (statusCode === 500) {
      return {
        title: "Server Error",
        description: "Something went wrong on our end. Please try again later.",
      };
    }
    return {
      title: "Something went wrong",
      description: "An unexpected error occurred. Please try refreshing the page.",
    };
  };

  const { title, description } = getErrorMessage();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <EmptyState
        title={title}
        description={description}
        actionLabel="Go Home"
        onAction={() => router.push("/")}
      />
    </div>
  );
}

Error.getInitialProps = ({ res, err, asPath }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? (err as any).statusCode : 404;
  return { statusCode, hasGetInitialPropsRun: true, err: err || undefined };
};

export default Error;



