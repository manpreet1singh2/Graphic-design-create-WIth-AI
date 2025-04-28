import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Design Beautiful Graphics with AI
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Create stunning designs for social media, marketing, and more with our AI-powered design assistant.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/chat">
                <Button className="px-8">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="outline" className="px-8">
                  Browse Templates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Describe Your Design</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Tell our AI what you need, from social media posts to business cards.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Get Template Recommendations</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Our AI suggests the perfect templates based on your requirements.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Customize and Download</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Personalize your chosen template and download the final design.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
