import React from "react";
import WorkoutLog from "./WorkoutLog";
import Navbar from "./Navbar";
import { auth } from "../firebase-config";

const Home = () => {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-red-500">
      <Navbar userId={userId} />
      {/* <WorkoutLog userId={userId} /> */}

      <p className="">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam luctus
        viverra enim sit amet scelerisque. Curabitur viverra a est a finibus. Ut
        in dolor erat. Nulla sagittis sem est, nec tincidunt metus varius at.
        Donec arcu nisl, consectetur sit amet magna ut, bibendum efficitur nisi.
        Integer nisi massa, facilisis eget facilisis vel, luctus at ex. Nulla
        pellentesque dictum pharetra. Nulla facilisi. Proin auctor eros ut lorem
        placerat, et vestibulum ante ullamcorper. Vestibulum euismod aliquam
        ante. Mauris in odio at libero malesuada tristique. Sed enim magna,
        mattis eget faucibus id, auctor sed massa. Phasellus mattis cursus
        rhoncus. Nam cursus tortor at dolor euismod dictum. Class aptent taciti
        sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
        Mauris rhoncus ac tortor eu vulputate. Praesent a placerat nunc. Nulla
        facilisi. Proin faucibus accumsan fringilla. Nunc volutpat lacinia eros
        et vulputate. Morbi tincidunt leo id urna lacinia ullamcorper. Nam vitae
        massa nisl. Vestibulum lectus odio, vehicula sed molestie sed, ultrices
        non est. Phasellus at mi ut libero interdum laoreet at non ipsum. Sed eu
        dui massa. Praesent non sapien vel nunc tincidunt congue. Suspendisse
        sollicitudin ligula at justo viverra scelerisque. Aenean at condimentum
        magna. Maecenas ut ullamcorper augue. Pellentesque habitant morbi
        tristique senectus et netus et malesuada fames ac turpis egestas. Donec
        tristique lacus quis fermentum accumsan. Cras vehicula facilisis arcu,
        sit amet vehicula quam tincidunt sed. Integer tristique ultrices libero,
        ut aliquam ex pharetra in. Vestibulum ante ipsum primis in faucibus orci
        luctus et ultrices posuere cubilia curae; Morbi a pellentesque sapien,
        ac feugiat neque. Suspendisse potenti. Mauris tempus, ante mattis rutrum
        fermentum, orci neque interdum sapien, ac molestie nunc tellus porttitor
        ex. Donec in libero ex. Quisque maximus tincidunt lectus quis tempus.
        Mauris magna nisl, bibendum sed massa nec, luctus auctor enim. Phasellus
        sit amet neque viverra, tempor sem nec, sodales arcu. Praesent malesuada
        bibendum purus et rhoncus. Fusce gravida enim et odio tincidunt, sodales
        iaculis nulla euismod. Ut consectetur urna eget convallis vestibulum.
        Nam ipsum erat, egestas a est id, lobortis iaculis massa. Curabitur id
        rhoncus tellus. Aliquam sagittis tortor ac dignissim vestibulum. Morbi
        posuere lectus quis maximus mollis. Vivamus facilisis orci ac ligula
        consectetur tempus. Curabitur scelerisque libero et urna malesuada
        malesuada. Nullam placerat mauris mauris, vel faucibus nisi laoreet ut.
        Nullam auctor mauris maximus, vulputate ipsum vitae, fringilla arcu.
        Maecenas quis rhoncus purus. Orci varius natoque penatibus et magnis dis
        parturient montes, nascetur ridiculus mus.
      </p>
    </div>
  );
};

export default Home;
