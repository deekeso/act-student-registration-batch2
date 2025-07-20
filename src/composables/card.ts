import { useRouter } from "vue-router";

export function useCardClick() {
  const router = useRouter();

  const handleCardClick = (route = '/some-route') => {
    console.log('Card clicked!');
    router.push(route); // Navigate to the specified route
  };

  return {
    handleCardClick,
  };
}
