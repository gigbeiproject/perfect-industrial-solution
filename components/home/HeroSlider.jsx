"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AUTOPLAY_MS = 6000;

export default function HeroSlider({ slides, yearsExperience }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  const goTo = useCallback(
    (index) => {
      setActive((index + slides.length) % slides.length);
    },
    [slides.length]
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [next, slides.length]);

  if (!slides || slides.length === 0) {
    return (
      <section className="relative flex h-[420px] items-center justify-center bg-ink text-white md:h-[560px]">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold md:text-5xl">
            Complete Solution <span className="text-brand">For Every Industry</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Add hero slides from the admin panel to showcase your products and services.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[520px] overflow-hidden bg-ink md:h-[620px]">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === active ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          aria-hidden={index !== active}
        >
          <Image
            src={slide.image_url}
            alt={slide.title}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/30" />

          <div className="relative z-10 flex h-full items-center">
            <div className="container-px">
              <div className="max-w-2xl">
                {slide.eyebrow && (
                  <p
                    className={`eyebrow mb-4 text-white/90 ${
                      index === active ? "reveal" : ""
                    }`}
                    style={{ animationDelay: "0.1s" }}
                  >
                    {slide.eyebrow}
                  </p>
                )}
                <h1
                  className={`text-3xl font-extrabold uppercase leading-tight text-white sm:text-4xl md:text-5xl ${
                    index === active ? "reveal" : ""
                  }`}
                  style={{ animationDelay: "0.2s" }}
                >
                  {slide.title}
                  {slide.subtitle && (
                    <>
                      <br />
                      <span className="text-brand">{slide.subtitle}</span>
                    </>
                  )}
                </h1>
                {slide.description && (
                  <p
                    className={`mt-5 max-w-lg text-sm text-white/80 md:text-base ${
                      index === active ? "reveal" : ""
                    }`}
                    style={{ animationDelay: "0.3s" }}
                  >
                    {slide.description}
                  </p>
                )}
                <div
                  className={`mt-8 flex flex-wrap gap-4 ${index === active ? "reveal" : ""}`}
                  style={{ animationDelay: "0.4s" }}
                >
                  {slide.cta_text && slide.cta_link && (
                    <Link href={slide.cta_link} className="btn-primary">
                      {slide.cta_text}
                      <ChevronRight size={16} />
                    </Link>
                  )}
                  {slide.cta_text_2 && slide.cta_link_2 && (
                    <Link href={slide.cta_link_2} className="btn-outline-dark">
                      {slide.cta_text_2}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/30 p-2 text-white transition-colors hover:bg-white hover:text-ink md:flex"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/30 p-2 text-white transition-colors hover:bg-white hover:text-ink md:flex"
          >
            <ChevronRight size={22} />
          </button>

          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goTo(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === active ? "w-8 bg-brand" : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {yearsExperience && (
        <div className="absolute bottom-0 right-6 z-20 hidden flex-col items-center justify-center bg-brand px-6 py-5 text-center text-white md:flex">
          <span className="text-2xl font-extrabold leading-none">{yearsExperience}</span>
          <span className="mt-1 text-[11px] font-medium leading-tight">
            Years Of
            <br />
            Experience
          </span>
        </div>
      )}
    </section>
  );
}
