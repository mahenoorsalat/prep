const fs = require('fs');

const svgPath = 'c:/Users/salat/OneDrive/Desktop/prep/Frame 1171277503.svg';
let svgContent = fs.readFileSync(svgPath, 'utf8');

// Replace standard width/height attributes with React variables
svgContent = svgContent.replace(/width="169"\s+height="41"/, 'width={width} height={height}');

// Wrap in component
const logoComponent = `interface LogoProps {
  size?: 'sm' | 'lg';
}

export default function Logo({ size = 'lg' }: LogoProps) {
  const width = size === 'sm' ? 134.74 : 169;
  const height = size === 'sm' ? 33.04 : 41;

  return (
    ${svgContent.trim()}
  );
}
`;

fs.writeFileSync('c:/Users/salat/OneDrive/Desktop/prep/src/components/ui/Logo.tsx', logoComponent, 'utf8');
console.log('Logo.tsx generated successfully!');
