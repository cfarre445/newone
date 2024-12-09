import { Theme } from "@aws-amplify/ui-react";

const myTheme: Theme = {
    name: 'custom-theme',
    tokens: {
      colors: {
        font: {
          primary: 'black', // Set text color to white
        },
        brand: {
          primary: {
            10: '#2e026d',  // Customize brand colors
            80: '#15162c', 
          },
        },
        background: {
          primary: '#FFFFFF', // Adjust background color
          secondary: '#2e026d',
        },
      },
      components: {
        button: {
          primary: {
            backgroundColor: '{colors.brand.primary.10}', // Example color from your theme
            color: '#FFFFFF', // Ensure button text is white
          },
        },
      },
    },
  };
  
export default myTheme;