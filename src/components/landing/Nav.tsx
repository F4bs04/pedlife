
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetClose, SheetTrigger } from "@/components/ui/sheet"; // Import Sheet components
import { Menu } from 'lucide-react'; // Import Menu icon
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile hook

export const Nav: React.FC = () => {
  const isMobile = useIsMobile();

  const navLinks = (
    <>
      <Link to="#recursos" className="leading-none py-2 md:py-0 md:self-center hover:text-primary">
        Recursos
      </Link>
      <Link to="#beneficios" className="leading-none py-2 md:py-0 md:self-center hover:text-primary">
        Benefícios
      </Link>
      <Link to="#depoimentos" className="leading-none py-2 md:py-0 md:self-center hover:text-primary">
        Depoimentos
      </Link>
    </>
  );

  return (
    <nav className="bg-[rgba(255,255,255,0.95)] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] z-20 sticky top-0 flex w-full flex-col items-stretch text-base text-gray-600 font-normal justify-center px-6 md:px-[70px] py-4 max-md:max-w-full">
      <div className="flex w-full max-w-[1280px] mx-auto items-center justify-between gap-5">
        <Link to="/">
          <img
            src="/lovable-uploads/b16ed0cb-3142-4d88-85ea-a5a2deccbba2.png"
            alt="Pedlife Logo"
            className="aspect-[4.27] object-contain w-[130px] md:w-[145px] shrink-0 max-w-full"
          />
        </Link>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] pt-10 bg-white">
              <div className="flex flex-col items-start gap-6 p-4">
                {React.Children.toArray(navLinks).map((link, index) => (
                  <SheetClose asChild key={index}>
                    {link}
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button asChild size="default" className="rounded-full px-6 w-full mt-4">
                    <Link to="/register">
                      Acesse Grátis
                    </Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center gap-[34px] flex-wrap">
            {navLinks}
            <Button asChild size="default" className="rounded-full px-6">
              <Link to="/register">
                Acesse Grátis
              </Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
