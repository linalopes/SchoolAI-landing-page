---
title: "Pepper's Ghost — School of Tomorrow's AI"
description: >-
  Open studio experiment: edit a small p5.js sketch, project four reflected
  images, and view a Pepper's Ghost illusion with a transparent pyramid on
  your phone.
peppers_ghost:
  hero:
    kicker: "Open studio experiment"
    title: "Pepper's Ghost"
    subtitle: "An old illusion made with light, reflection and a screen."
    paragraphs:
      - >-
        Pepper's Ghost is an optical illusion popularized in the 19th century by
        John Henry Pepper, based on an earlier design by Henry Dircks. An angled
        transparent surface reflects a hidden illuminated scene into view.
      - >-
        This small version uses the same principle. Instead of a stage, it uses
        your phone screen. Instead of a large glass panel, it uses four small
        transparent surfaces.
  steps_aria: "How to use this page"
  steps:
    - number: "1. Try it"
      text: "See the apparition already running."
    - number: "2. Change it"
      text: "Edit a number, word, shape or color."
    - number: "3. Run it"
      text: "See your change."
    - number: "4. Use with Ghost"
      text: "Place the transparent pyramid at the center of the phone."
  studio:
    title: "Make your own ghost"
    lede: >-
      Edit the code, run the sketch, place the transparent pyramid on your
      screen and see what happens.
    examples_aria: "Example sketches"
    examples:
      - id: orb
        label: Orb
      - id: creature
        label: Creature
      - id: particles
        label: Particles
      - id: text
        label: Text
    editor_aria_label: "Pepper's Ghost sketch"
    error_title: "Something in the code needs attention"
    error_hint: "Check the spelling and press RUN again."
    run_label: Run
    reset_label: Reset
    copy_label: "Copy code"
    copy_done_label: Copied
    preview_hint: >-
      Preview your sketch here. Use Ghost mode when placing the transparent
      pyramid on your phone.
    ghost_button: "Use with Ghost"
    orient_hint: "For a larger apparition, rotate your phone."
    replace_confirm: "Replace your edited sketch with this example?"
    exit_aria_label: "Exit Ghost mode"
  use:
    title: "Use with the transparent pyramid"
    steps:
      - "Fold and close the transparent shape."
      - "Increase your screen brightness."
      - "Dim the surrounding lights."
      - "Place the small opening at the center of the screen."
      - "Tap Use with Ghost."
    note: "The illusion works best in a dark environment."
  template:
    title: "Build your own pyramid"
    lede: >-
      Want to make another one? Download the 6 cm template, print it at 100%,
      trace it onto transparent acetate, cut and fold.
    download_label: "Download pyramid template ↓"
    download_href: "/imgs/pepper_ghost_pyramid_template_6cm.svg"
    download_filename: "pepper_ghost_pyramid_template_6cm.svg"
    meta: "6 cm · SVG · print at 100%"
  calibrate:
    title: Display
    lede: >-
      Handmade pyramids and phones vary. Adjust until the apparition sits
      cleanly inside the acetate.
    size_label: "Ghost size"
    distance_label: "Distance from center"
    reset_label: "Reset display"
  how:
    title: "How it works"
    lede: >-
      The phone displays four versions of the same animation. Each transparent
      side reflects one version toward the center. Your eyes perceive those
      reflections as a small floating image.
  history:
    title: "A short history"
    paragraphs:
      - >-
        Henry Dircks proposed an earlier optical design. John Henry Pepper
        popularized the stage illusion in the nineteenth century, and it took
        his name.
      - >-
        The original version used angled glass and a hidden, brightly lit scene.
        The audience saw a figure that appeared to occupy the stage, though it
        was only a reflection.
      - >-
        This phone version uses the same basic reflection principle at a tiny
        scale: four images, four transparent faces, one floating ghost.
  credits:
    built_prefix: "Built at"
    school_name: "School of Tomorrow's AI"
    school_href: "/"
    body: >-
      School of Tomorrow's AI uses artistic research, speculative prototyping,
      and science and technology as material for experimentation.
---

# Pepper's Ghost

Editorial source for `/peppers-ghost.html`. Interactive sketch examples, optical
calibration defaults, iframe execution and localStorage keys live in
`src/scripts/peppers-ghost.ts`. Do not invent historical claims beyond the copy
above.
