export function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant bg-surface-container-low py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div className="flex flex-col gap-1">
          <span className="font-headline text-headline-md italic text-on-surface">ivvazh</span>
        </div>
        <p className="mt-2 text-body-md text-on-surface-variant">
          © {new Date().getFullYear()} ivvazh. Built for real connection.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {["About", "Safety", "Guidelines", "Support"].map((label) => (
            <a
              key={label}
              href="#"
              className="text-body-md text-tertiary underline-offset-4 decoration-primary hover:underline"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
