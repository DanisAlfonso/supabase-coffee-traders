import Image from 'next/image'

export default function StoryPage() {
  return (
    <main className="min-h-screen py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Our Journey</h1>
          <p className="mt-6 text-lg leading-8">
            From humble beginnings to a mission of bringing exceptional coffee to discerning enthusiasts.
          </p>
        </div>

        {/* Origins Section */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gray-900 px-6 py-20 shadow-xl lg:px-8">
            <Image
              src="/images/coffee-plantation.jpg"
              alt="Coffee plantation at sunrise"
              className="absolute inset-0 h-full w-full object-cover opacity-20"
              width={1200}
              height={800}
              priority
            />
            <div className="relative mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-white">Our Origins</h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Selvas Coffee bridges the misty highlands of Honduras with coffee lovers across Europe. 
                We partner directly with small-scale farmers, sourcing beans of exceptional quality while 
                ensuring fair pay and lasting support. Our mission? To redefine specialty coffee by uniting 
                ethical trade, environmental care, and craftsmanship. Each bean carries a story—of hands 
                that nurtured it, landscapes that shaped it, and a vision where quality coffee fuels both 
                connection and sustainability. Together, we&apos;re crafting more than coffee: a future 
                rooted in fairness, flavor, and mutual respect.
              </p>
            </div>
          </div>
        </div>

        {/* Mission and Values */}
        <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
            <p className="mt-6 text-lg leading-8">
              At Selvas Coffee, we believe that every cup of coffee tells a story. Our mission is to share these stories while ensuring that both our producers and customers thrive. We&apos;re committed to:
            </p>
            <div className="mt-10 max-w-2xl space-y-8 text-base leading-7">
              <div className="relative pl-9">
                <dt className="inline font-semibold">
                  <svg className="absolute left-1 top-1 h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  Quality Without Compromise
                </dt>
                <dd className="inline"> - Sourcing only the finest beans from carefully selected farms and cooperatives.</dd>
              </div>
              <div className="relative pl-9">
                <dt className="inline font-semibold">
                  <svg className="absolute left-1 top-1 h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  Sustainable Partnerships
                </dt>
                <dd className="inline"> - Building lasting relationships with farmers who share our values.</dd>
              </div>
              <div className="relative pl-9">
                <dt className="inline font-semibold">
                  <svg className="absolute left-1 top-1 h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  Environmental Stewardship
                </dt>
                <dd className="inline"> - Promoting sustainable farming practices and reducing our environmental impact.</dd>
              </div>
            </div>
          </div>
        </div>

        {/* Journey Section */}
        <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold tracking-tight">Our Journey</h2>
              <p className="mt-6 text-lg leading-8">
                We&apos;ve walked alongside small coffee farmers in Honduras, witnessing their relentless labor and the systemic injustices they face. Their harvests, grown with care under harsh conditions, often yield prices that trap them in cycles of poverty, leaving them vulnerable to exploitative practices and volatile markets.
              </p>
              <p className="mt-6 text-lg leading-8">
                At Selvas Coffee, we&apos;re committed to forging a different path. By partnering directly with growers, we ensure fair pay that honors their expertise and sustains their livelihoods. Transparency and sustainability guide every step—from bean selection to your morning brew.
              </p>
              <p className="mt-6 text-lg leading-8">
                Each purchase supports a supply chain where dignity and quality thrive. This isn&apos;t just coffee; it&apos;s a collective effort to reshape an industry. Join us in fostering a future where fairness and flavor grow hand in hand.
              </p>
            </div>
            <div className="flex flex-col space-y-6 lg:space-y-8">
              <Image
                src="/images/coffee-farmer.jpg"
                alt="Coffee farmer inspecting beans"
                className="aspect-[3/2] w-full rounded-2xl object-cover"
                width={800}
                height={533}
              />
              <Image
                src="/images/coffee-roasting.jpg"
                alt="Coffee roasting process"
                className="aspect-[3/2] w-full rounded-2xl object-cover"
                width={800}
                height={533}
              />
            </div>
          </div>
        </div>

        {/* Future Vision */}
        <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight">Looking Forward</h2>
            <p className="mt-6 text-lg leading-8">
              As we look to the future, our commitment to quality and sustainability only grows stronger. We&apos;re investing in innovative farming techniques, expanding our network of partner farms, and developing new ways to bring exceptional coffee experiences to our customers.
            </p>
            <p className="mt-6 text-lg leading-8">
              We invite you to join us on this journey, whether you&apos;re a coffee enthusiast, a potential partner, or simply someone who believes in the power of doing business the right way.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 
