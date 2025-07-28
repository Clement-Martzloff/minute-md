import { RefObject, useEffect } from "react";

function useScrollToBottom(
  scrollContainerRef: RefObject<HTMLDivElement | null>,
  bottomRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const observerTarget = scrollContainerRef.current;
    const bottom = bottomRef.current;

    if (!observerTarget || !bottom) return;

    const observer = new MutationObserver(() => {
      bottom.scrollIntoView({ behavior: "smooth" });
    });

    observer.observe(observerTarget, {
      childList: true,
      subtree: true,
      // characterData: true,
    });

    return () => observer.disconnect();
  }, [scrollContainerRef, bottomRef]); // Add refs to dependency array
}

export default useScrollToBottom;
