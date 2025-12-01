<script>
import { onMount } from "svelte";
import { antiGravity3D } from "$lib/antigravity3D";
import { initParticleField, cursorMagnet } from "$lib/gravityParticles";
import { modal, openModal, closeModal } from "$lib/modal";
import { darkMode, toggleTheme } from "$lib/theme";
import { gsap } from "gsap";

let layer1, layer2, layer3, particleContainer;
let modalData;
let isDark = true;

const projects = [
  { title: "Hospital Workflow Automation", img: "/project1.jpg", description: "Automation system for hospitals" },
  { title: "AI Image Generator", img: "/project2.jpg", description: "Generate images for Adobe Stock" },
  { title: "UI Component Library", img: "/project3.jpg", description: "Reusable UI kit for web apps" },
];

onMount(() => {
  initParticleField(particleContainer, 70);
  cursorMagnet(particleContainer, 160);
  antiGravity3D([layer1, layer2, layer3]);

  gsap.from(".about, .projects, .cta", {
    opacity:0, y:50, stagger:0.2, duration:1, scrollTrigger: { trigger:".about", start:"top 80%" }
  });

  darkMode.subscribe(value => { isDark = value; });
});

function switchTheme() { toggleTheme(); }
modal.subscribe(value => modalData = value);
</script>

<main class:dark-theme={!isDark}>
  <!-- Aurora Background -->
  <div class="aurora"></div>

  <!-- Particle background -->
  <div class="particles" bind:this={particleContainer}></div>

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

<style>
/* Base */
body{ margin:0; font-family:-apple-system, SF Pro Display, Inter; background:#000; color:white; overflow-x:hidden; }
.dark-theme{ background:#000; color:white; }
.aurora{ position:fixed; inset:0; background:url("/aurora.png") center/cover no-repeat; z-index:-1; opacity:0.25; }
.particles{ position:fixed; inset:0; pointer-events:none; z-index:0; }
.particle{ width:6px; height:6px; border-radius:50%; background:white; position:absolute; filter:blur(2px); }

.theme-btn{ position:fixed; top:24px; right:24px; padding:12px 24px; border-radius:20px; border:none; background:rgba(255,255,255,0.1); cursor:pointer; z-index:10; }

.hero{ height:100vh; display:flex; align-items:center; justify-content:center; perspective:1200px; position:relative; z-index:1; }
.layer{ position:absolute; transition:0.3s; filter:drop-shadow(0 0 12px rgba(255,255,255,.18)); }
.hero h1{ font-size:3rem; text-align:center; z-index:2; }
.hero p{ font-size:1.2rem; text-align:center; z-index:2; }

.about, .projects, .cta{ padding:120px 24px; z-index:2; position:relative; }
.container{ max-width:900px; margin:0 auto; }

.projects .grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:20px; margin-top:20px; }
.project-card{ background:rgba(255,255,255,0.05); padding:20px; border-radius:16px; box-shadow:0 10px 30px rgba(255,255,255,.05); cursor:pointer; transition:transform .4s; backdrop-filter:blur(6px);}
.project-card:hover{ transform:translateY(-8px); box-shadow:0 20px 50px rgba(255,255,255,.12); }
.project-card img{ width:100%; border-radius:12px; margin-bottom:12px; }

.cta{ text-align:center; background:linear-gradient(180deg, rgba(10,132,255,0.05), rgba(255,255,255,0)); }
.btn.primary{ padding:16px 48px; border-radius:40px; background:#0A84FF; color:white; font-size:1.1rem; border:none; cursor:pointer; }

.glass{ background: rgba(255,255,255,0.05); border-radius:20px; backdrop-filter: blur(10px); padding:24px; margin:24px 0; }

.modal-backdrop{ position:fixed; inset:0; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:99; }
.modal-content{ background:#111; padding:36px; border-radius:20px; max-width:600px; width:90%; text-align:center; }
.modal-content img{ width:100%; border-radius:12px; margin:12px 0; }
</style>