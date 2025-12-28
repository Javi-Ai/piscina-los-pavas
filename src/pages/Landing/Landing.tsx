import { Features } from './components/Features/Features';
import Main from './components/Hero/Hero';

export default function Landing() {
  return (
    <>
      <Main />
      <div className="container mx-auto px-16 relative">
        <Features />
      </div>
    </>
  );
}
