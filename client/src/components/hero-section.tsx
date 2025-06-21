import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

const heroImages = [
	"/heroImage1.jpeg",
	"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
	"https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
	"https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
];

export function HeroSection() {
	const plugin = useRef(Autoplay({ delay: 3500, stopOnInteraction: false }));

	const scrollToProducts = () => {
		const productsSection = document.getElementById("products");
		if (productsSection) {
			productsSection.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<section className="relative overflow-hidden">
			<div className="bg-gradient-to-r from-artisan-brown/90 to-artisan-chocolate/90 relative">
				<div className="absolute inset-0 bg-black/20 z-10 pointer-events-none"></div>{" "}
				<Carousel className="w-full" plugins={[plugin.current]}>
					<CarouselContent>
						{heroImages.map((img, idx) => (
							<CarouselItem key={idx}>
								<div className="relative bg-center bg-cover bg-no-repeat min-h-[600px] flex items-center" style={{ backgroundImage: `url('${img}')` }}>
									<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
										<div className="max-w-3xl">
											<h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">Handcrafted with Love, Made for You</h1>
											<p className="text-xl text-white/90 mb-8 leading-relaxed">
												Discover our collection of beautiful, handmade crafts created by skilled artisans. Each piece tells a story and brings warmth to your
												home.
											</p>
											<div className="flex flex-col sm:flex-row gap-4">
												<Button
													size="lg"
													className="bg-artisan-chocolate hover:bg-artisan-brown text-white px-8 py-4 transition-all duration-200 transform hover:scale-105"
													onClick={scrollToProducts}
												>
													Explore Collection
												</Button>
												<Button
													size="lg"
													className="bg-artisan-chocolate hover:bg-artisan-brown text-white px-8 py-4 transition-all duration-200 transform hover:scale-105"
												>
													Learn Our Story
												</Button>
											</div>
										</div>
									</div>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
		</section>
	);
}
