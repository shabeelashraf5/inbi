import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SupplyChainLoading() {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[350px]" />
          <Skeleton className="h-4 w-[500px]" />
        </div>
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>

      {/* Hero Workflow Section Skeleton */}
      <Card className="border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          {/* Workflow Timeline Skeleton */}
          <div className="flex items-center justify-between px-8 py-4 relative bg-muted/20 rounded-xl">
             {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                   <Skeleton className="h-8 w-8 rounded-full" />
                   <Skeleton className="h-3 w-16" />
                </div>
             ))}
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border/50">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Activity Column Skeleton */}
         <div className="lg:col-span-2 space-y-8">
            <Card className="border-border/50">
               <CardHeader>
                  <Skeleton className="h-5 w-40" />
               </CardHeader>
               <CardContent>
                  <Skeleton className="h-[320px] w-full rounded-xl" />
               </CardContent>
            </Card>

            <Card className="border-border/50 overflow-hidden">
               <CardHeader className="py-4 border-b">
                  <Skeleton className="h-5 w-40" />
               </CardHeader>
               <div className="p-0">
                  {[1, 2, 3, 4, 5].map((i) => (
                     <div key={i} className="px-6 py-4 flex items-center justify-between border-b border-border/20 last:border-0">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/6" />
                     </div>
                  ))}
               </div>
            </Card>
         </div>

         {/* Alerts & Sidebar Column Skeleton */}
         <div className="space-y-8">
            <Card className="border-rose-100 bg-rose-50/10 dark:border-rose-900/30">
               <CardHeader>
                  <Skeleton className="h-4 w-32" />
               </CardHeader>
               <CardContent className="space-y-4">
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
               </CardContent>
            </Card>

            <Card className="border-border/50">
               <CardHeader>
                  <Skeleton className="h-4 w-32" />
               </CardHeader>
               <CardContent className="space-y-4">
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
