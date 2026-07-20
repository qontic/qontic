# Q-Ontic Lab site update plan

## Goal

Reorganize Q-Ontic Lab around physics topics and modules while preserving direct access to simulations, notebooks, videos, and other resources.

The homepage should initially present two sections: **Core Concepts** and **Beyond the Basics**. Each module should have a canonical landing page collecting its related resources. Courses and other curated collections should reference modules, individual resources, or both.

## Core content model

### Resources

A resource is an individual simulation, notebook, video, instructor activity, paper, or related item.

Each resource must have a stable unique `id` and normally identifies its parent module through a `module` field. Resources may also carry intrinsic metadata such as physics topics, interpretations, level, and technical requirements.

Courses and homepage placement are deliberately not stored as tags on modules or resources.

### Modules

A module is the principal educational unit and corresponds to a physics topic such as Quantum Tunneling, Double Slit, Stern–Gerlach, or Bell Correlations.

Each module has stable metadata and may contain any number of resources.

### Sections

A section is an ordered group inside a collection. It may contain whole modules, individual resources, or both.

Sections are local to their parent collection rather than global objects. The same module or resource may therefore appear under different section titles in different collections.

Examples include:

- **Core Concepts** and **Beyond the Basics** on the homepage;
- chapters or units in a course;
- weeks in a seminar;
- parts of a workshop;
- segments in a learning path.

### Collections

A collection is a curated view or sequence. Examples include the homepage, a course, a workshop, or a learning path.

The hierarchy is:

```text
Collection
  -> Section
    -> Module or Resource
```

A collection may reference:

- a whole module;
- one individual resource;
- several individual resources from the same module;
- a mixture of modules and resources.

Collection-specific instructions, labels, sequencing, and preferred notebook mode belong in the collection definition rather than in the referenced resource.

Courses are a specific kind of collection. They may remain in `courses/` for authoring convenience while using the same section-and-item schema as files in `collections/`.

## Notebook modes

Notebooks should support two views of the same source document:

- **Concise:** the central question, simulation, essential instructions, observations, and only the equations needed for the activity.
- **Detailed:** the concise material plus derivations, extended explanations, historical context, technical notes, optional advanced activities, and references.

The two modes should not be maintained as separate notebook files. Detailed-only sections should be marked in the HTML and controlled by shared CSS and JavaScript. Concise should be the default for new visitors, with the selected mode remembered locally.

## Metadata examples

### Module

```json
{
  "id": "quantum-tunneling",
  "title": "Quantum Tunneling",
  "summary": "Explore transmission through classically forbidden regions using several quantum representations.",
  "topics": ["wave-mechanics", "potential-barriers"],
  "interpretations": ["orthodox", "pilot-wave", "many-worlds"],
  "order": 30,
  "relatedModules": ["potential-step", "wave-packets"]
}
```

### Resource

```json
{
  "id": "tunneling-pilot-wave-notebook",
  "title": "Pilot-Wave Tunneling",
  "type": "notebook",
  "module": "quantum-tunneling",
  "topics": ["wave-mechanics", "potential-barriers"],
  "interpretations": ["pilot-wave"],
  "level": "intermediate",
  "description": "Explore tunneling using wave-packet dynamics and Bohmian trajectories.",
  "entry": "index.html",
  "status": "published"
}
```

### Homepage collection

```json
{
  "id": "homepage",
  "type": "homepage",
  "title": "Q-Ontic Lab",
  "sections": [
    {
      "id": "core-concepts",
      "title": "Core Concepts",
      "items": [
        { "type": "module", "id": "free-particle" },
        { "type": "module", "id": "double-slit" }
      ]
    },
    {
      "id": "beyond-the-basics",
      "title": "Beyond the Basics",
      "items": [
        { "type": "module", "id": "bell-correlations" }
      ]
    }
  ]
}
```

### Course collection

```json
{
  "id": "intro-quantum",
  "type": "course",
  "title": "Introduction to Quantum Mechanics",
  "sections": [
    {
      "id": "wave-mechanics",
      "title": "Wave Mechanics",
      "items": [
        { "type": "module", "id": "free-particle" },
        {
          "type": "resource",
          "id": "double-slit-analytical-simulation",
          "label": "In-class demonstration"
        },
        {
          "type": "resource",
          "id": "tunneling-pilot-wave-notebook",
          "mode": "concise",
          "note": "Complete the guided questions before class."
        }
      ]
    }
  ]
}
```

## Implementation stages

### Stage 1 — Content model and validation

- [x] Document the architecture and update plan.
- [x] Support collections containing ordered sections.
- [x] Allow section items to reference modules or resources directly.
- [x] Add the initial homepage collection with **Core Concepts** and **Beyond the Basics**.
- [ ] Complete module metadata under `modules/`.
- [ ] Add stable `id`, `module`, `topics`, `interpretations`, and `level` fields to all resource metadata.
- [x] Do not add course or homepage tags to modules or resources.
- [x] Use the same section-and-item format for courses and other collections.
- [x] Extend `scripts/build-catalog.py` to load modules and collections, resolve references, and validate IDs.
- [x] Preserve the current `catalog.json` output while introducing a richer `site-data.json` file.

### Stage 2 — Homepage and module pages

- [ ] Replace the homepage resource-category tabs with the **Core Concepts** and **Beyond the Basics** sections from the homepage collection.
- [ ] Generate or render canonical module landing pages.
- [ ] Keep separate indexes for simulations, notebooks, videos, and other resource types.
- [ ] Add stable "Back to module" navigation to resources.

### Stage 3 — Concise and detailed notebook modes

- [ ] Add shared notebook-mode CSS and JavaScript.
- [ ] Convert one notebook as a pilot, initially Quantum Tunneling.
- [ ] Review the concise version for educational coherence rather than merely hiding arbitrary paragraphs.
- [ ] Migrate other notebooks after the pilot is accepted.

### Stage 4 — Courses and additional collections

- [ ] Render course pages from collection metadata.
- [ ] Allow course entries to choose a notebook mode and add course-specific notes.
- [ ] Add learning paths, workshops, and other curated collections only after the module structure is stable.

## Constraints

- Keep the site static and compatible with GitHub Pages.
- Do not convert the whole site to React.
- Do not introduce a database or content-management system.
- Do not duplicate notebooks for concise and detailed modes.
- Preserve existing URLs during the transition whenever practical.
- Introduce the new model incrementally so current simulations and notebooks continue to work.
