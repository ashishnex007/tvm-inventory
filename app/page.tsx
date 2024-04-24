import { ChakraProvider } from "@chakra-ui/react";

import Homepage from "@/pages/Homepage";
import Homex from "@/pages/Homex";



export default function Home() {
  return (
    <ChakraProvider>
      <main>
        <Homepage />
      </main>
    </ChakraProvider>
  );
}