import Lottie from 'react-lottie';
import loadingAnimation from '../lotties/loading.json';

function Loading({ props }) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <>
      {console.log(props)}
      {props === 'home' && (
        <main className="col-span-4 py-10 h-full flex flex-col items-center justify-center gap-4">
          <Lottie options={defaultOptions} width={100} height={100} />
          <p>Loading!</p>
        </main>
      )}
      {props === undefined && (
        <main className="w-screen h-screen flex flex-col items-center justify-center gap-4">
          <Lottie options={defaultOptions} width={100} height={100} />
          <p>Loading!</p>
        </main>
      )}
    </>
  );
}

export default Loading;
