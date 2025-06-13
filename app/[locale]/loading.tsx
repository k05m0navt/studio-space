import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section Skeleton */}
      <div className="flex flex-col lg:flex-row items-center gap-8 mb-16">
        <div className="w-full lg:w-1/2 space-y-6">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-20 w-5/6" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 w-36" />
            <Skeleton className="h-12 w-36" />
          </div>
        </div>
        <div className="w-full lg:w-1/2 aspect-video">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      </div>

      {/* Features Section Skeleton */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 rounded-xl border">
              <Skeleton className="h-10 w-10 rounded-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6 mb-1" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section Skeleton */}
      <div>
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-48 mx-auto" />
          <Skeleton className="h-6 w-80 mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 rounded-xl border">
              <Skeleton className="h-8 w-32 mb-2" />
              <div className="flex items-end gap-1 mb-4">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-6 w-16 mb-1" />
              </div>
              <Skeleton className="h-px w-full my-4" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
              </div>
              <Skeleton className="h-10 w-full mt-6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 