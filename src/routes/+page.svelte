<script>
import { onMount } from "svelte";
import { antiGravity3D } from "$lib/antigravity3D";
import { modal, openModal, closeModal } from "$lib/modal";
import { darkMode, toggleTheme } from "$lib/theme";
import { initSmoothScroll } from "$lib/scroll";
import { gsap } from "gsap";

let layer1, layer2, layer3, wrapper, content;
let modalData;
let isDark = true;

const projects = [
  { title: "Hospital Workflow Automation", img: "/project1.jpg", description: "Automation system for hospitals" },
  { title: "AI Image Generator", img: "/project2.jpg", description: "Generate images for Adobe Stock" },
  { title: "UI Component Library", img: "/project3.jpg", description: "Reusable UI kit for web apps" },
];

onMount(() => {
  antiGravity3D([layer1, layer2, layer3]);
  initSmoothScroll(wrapper, content);

  gsap.from(".about, .projects, .cta", {
    opacity:0, y:50, stagger:0.2, duration:1, scrollTrigger: { trigger:".about", start:"top 80%" }
  });

  darkMode.subscribe(value => { isDark = value; });
});

function switchTheme() { toggleTheme(); }
modal.subscribe(value => modalData = value);
</script>

<div bind:this={wrapper}>
  <div bind:this={content}>
    <main class:dark-theme={!isDark}>
      <!-- Aurora Background -->
      <div class="aurora"></div>

      <!-- Theme toggle -->
      <button class="theme-btn" on:click={switchTheme}>{isDark ? 'Light Mode' : 'Dark Mode'}</button>

      <!-- Hero Section -->
      <section class="hero glass">
        <img src="/me.png" class="layer" bind:this={layer1}/>
        <h1 class="layer" bind:this={layer2}>Faishal Fx</h1>
        <p class="layer" bind:this={layer3}>Creative Developer • Automation Engineer</p>
      </section>

      <!-- About -->
      <section class="about glass">
        <div class="container">
          <h2>About Me</h2>
          <p>I build automation systems, web interfaces, and creative AI experiences that feel effortless and modern.</p>
        </div>
      </section>

      <!-- Projects -->
      <section class="projects glass">
        <div class="container">
          <h2>Featured Projects</h2>
          <div class="grid">
            {#each projects as project}
              <div class="project-card" on:click={() => openModal(project)}>
                <img src={project.img} alt={project.title}/>
                <h3>{project.title}</h3>
              </div>
            {/each}
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta glass">
        <h2>Let's build something timeless.</h2>
        <button class="btn primary">Hire Me</button>
      </section>

      <!-- Modal -->
      {#if modalData.open}
        <div class="modal-backdrop" on:click={closeModal}>
          <div class="modal-content" on:click|stopPropagation>
            <h2>{modalData.content.title}</h2>
            <img src={modalData.content.img} alt={modalData.content.title}/>
            <p>{modalData.content.description}</p>
            <button class="btn primary" on:click={closeModal}>Close</button>
          </div>
        </div>
      {/if}
    </main>
  </div>
</div>

<style>
/* Sama seperti app.css sebelumnya, tetap gunakan semua styles hero, particles, glassmorphism, modal, CTA, aurora */
</style>