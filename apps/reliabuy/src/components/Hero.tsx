import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function Hero() {
  return (
    <div className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 animate-pulse">
            Reliabuy
          </h1>
          <p className="mt-6 text-lg leading-8 text-foreground/60">Buy product with reliability and ensurity</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <div className="relative w-full max-w-lg">
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full rounded-full border border-primary/20 focus:border-primary/60 focus:ring focus:ring-primary/30 focus:ring-opacity-50 bg-background"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60" />
              <Button className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full" size="sm">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>
    </div>
  )
}

