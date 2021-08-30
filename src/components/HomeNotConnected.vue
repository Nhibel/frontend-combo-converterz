<template>
  <div>
    <div class="text-center text-white pb-2">
      <b-row class="mb-2 mt-3">
        <b-col>
          <h4>Ouais salut</h4>
        </b-col>
      </b-row>
      <h5 class="pb-2">C'est quoi ce site ?</h5>
      <p>
        Sur Youtube, y a plein de vidéos pour bosser ses combos, mais les
        indications sont sous un format particulier.
      </p>
      <div class="embed-responsive embed-responsive-21by9">
        <iframe
          class="embed-responsive-item"
          width="560"
          height="315"
          src="https://www.youtube.com/embed/qLMCrNNQkc8?start=58"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
      <p>
        Genre pour le combo au dessus :
        <span class="font-weight-bold"
          >5M2M dl 2S 5H dl sd 66 jM dl j2S 669 jLL2H jC jLLS2S j214H</span
        >
      </p>
      <p>
        C'est pour s'adapter à tous les gamepads, pour les chiffres, ça reprends
        un pavé numérique (1 = bas-gauche, 2 = bas, 3 = bas-droite...)
      </p>
      <p>
        L c'est pour coup léger (carré sur psx), S pour X, et ainsi de suite...
      </p>
      <p>Mais moi je trouve pas ça lisible, alors j'ai essayé de faire un truc à ma façon</p>
      <p>
        Sur cette appli, on peut copier/coller le combo ci-dessus, et ça donne
        ça :
      </p>
      <b-img
        src="/assets/img/exemple_combo_img.png"
        alt="combo en image"
        fluid
      ></b-img>
      <p>Perso ça me parle plus</p>
      <p>Voilà voilà</p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
