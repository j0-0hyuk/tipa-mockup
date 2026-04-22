import { Flex } from '@docs-front/ui';
import NavItem from '@/routes/_authenticated/-components/SideNavigation/components/deprecated/NavItem/NavItem';
import { getProductsQueryOptions } from '@/query/options/products';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useSideNavigationModalStore } from '@/store/useSideNavigationModalStore';
import { useBreakPoints } from '@/hooks/useBreakPoints';

export const NavItemList = () => {
  const { data: products } = useSuspenseQuery(getProductsQueryOptions());
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const currentProductId = params.productId ? Number(params.productId) : null;
  const { close } = useSideNavigationModalStore();
  const { isMobile } = useBreakPoints();
  const handleProductClick = (productId: number) => {
    navigate({ to: `/c/${productId}` });
    if (isMobile) {
      close();
    }
  };

  return (
    <Flex direction="column" gap={1.5}>
      {products.map((product) => (
        <NavItem
          key={product.id}
          productId={product.id}
          currentProductId={currentProductId}
          label={product.itemName}
          onClick={() => handleProductClick(product.id)}
        />
      ))}
    </Flex>
  );
};
