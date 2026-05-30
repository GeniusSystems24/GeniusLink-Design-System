---
name: geniuslink-design
description: Use this skill to generate well-branded interfaces and assets for GeniusLink — a bilingual (English + Arabic) accounting / ERP product — either for production or throwaway prototypes / mocks / decks. Contains essential design guidelines, colors, typography, fonts, asset references, and a UI kit of reusable components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files (`colors_and_type.css`, `ui_kits/genius_link/`, `preview/`, `assets/`).

If creating visual artifacts (slides, mocks, throwaway prototypes, demos), **copy assets out** of this folder into the target project and create static HTML files for the user to view — link `colors_and_type.css`, reuse the JSX components in `ui_kits/genius_link/`, and reference logos from `assets/`.

If working on production code, copy assets and read the rules here to become an expert in designing with this brand — the system is bilingual (English + Arabic, side-by-side), dark-first with a parallel light theme, and built around the section-card-with-marker-bar component as its central visual device.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some clarifying questions (target surface, screens needed, dark or light theme, English-only or bilingual), and then act as an expert designer who outputs HTML artifacts *or* production code, depending on the need.
