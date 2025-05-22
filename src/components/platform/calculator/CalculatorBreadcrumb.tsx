
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface CalculatorBreadcrumbProps {
  categorySlug?: string;
  categoryTitle?: string;
  medicationSlug?: string;
  medicationName?: string;
  isResultPage?: boolean;
}

const CalculatorBreadcrumb: React.FC<CalculatorBreadcrumbProps> = ({
  categorySlug,
  categoryTitle,
  medicationSlug,
  medicationName,
  isResultPage = false,
}) => {
  if (!categorySlug || !categoryTitle || !medicationName) {
    // Simplified breadcrumb if some info is missing (e.g. during loading or error)
    return (
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/platform/calculator">Calculadora</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/platform/calculator">Calculadora</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={`/platform/calculator/${categorySlug}`}>{categoryTitle}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {isResultPage && medicationSlug ? (
            <BreadcrumbLink asChild>
              <Link to={`/platform/calculator/${categorySlug}/${medicationSlug}`}>Calc: {medicationName}</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Calc: {medicationName}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {isResultPage && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Resultado</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CalculatorBreadcrumb;
