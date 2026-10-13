---
title: Res UCN Research Lab
emoji: 🧠
colorFrom: blue
colorTo: purple
sdk: static
app_file: index.html
pinned: false
license: mit
short_description: Res_UCN architecture and Quinsh research demo
---

# Res_UCN — Interactive Research Lab

A **fully static, responsive** website for the AIT301 group project *ResNet Unified Convolutional Network (Res_UCN)*. It presents the whole architecture while distinguishing **Wilbert Andrew Yonathan's individual contribution: the Quinsh activation function**. This is a research explanation website rather than a trained classifier.

**Original project:** [Res_UCN source repository](https://github.com/WAYTECHG/Res_UCN-Resnet-Unified-Convolution-Network).

## Features

- **Overview:** high-level research goals, published metrics and residual feature-flow graphic.
- **Architecture:** interactive inspector for four residual stages.
- **Quinsh Studio:** live plot of `Q(x) = γ(x − δ) σ(w(x − δ)) + αx`; sliders for γ, δ, w, α, presets, output/derivative comparison with ReLU and Swish.
- **Five modules:** concepts and individual contributor credits for ADSGC, CIAC, Weighted BatchNorm, Quinsh and DE-Stopping.
- **Results:** group-reported accuracy (Res_UCN **91.45%**, baseline ResNet-18 **89.90%**); parameters (**~3.4M** vs **~11.2M**); and reported training time (**17m17s** vs **24m**).
- **CIFAR-10 Lab:** interactive label gallery with all ten standard classes, filters (animals and vehicles), illustrative category icons, client-side image preprocessing demonstration, optional local photo upload, flip, brightness, pixel grid, and numerical RGB/normalization inspector based on the group's slide 21.
- **Credits:** highlights Quinsh as Wilbert's contribution while documenting all team roles.

> **No ONNX, `.pt` checkpoint, server, fabricated predictions, classifier results or ablation experiments are included in the interactive gallery.** Gallery icons and illustrated input examples are conceptual, not samples from the original CIFAR-10 dataset. Standard CIFAR-10 dataset cardinalities/label names are general dataset specifications; original project metrics are sourced from slide 22 of the group presentation.

## Run locally

Option A: open `index.html` directly in Chrome/Edge/Firefox. All interactive features work without a build process. The Google Fonts stylesheet is an optional online dependency; fallback system fonts are provided.

Option B: for convenient development in PowerShell:

```powershell
cd path\to\resucn-cifar-research-showcase
python -m http.server 8080
```

Then visit http://localhost:8080. No `pip install`, Docker, ML weights or Python server backend is needed for deployed versions.

## Deploy to Hugging Face Spaces (Static SDK)

1. Create a Hugging Face Space using the **Static** SDK, **not Docker or Gradio**.
2. Upload `index.html`, `styles.css`, `app.js`, `README.md`, `assets/favicon.svg`, `docs/SOURCE_NOTES.md`, `LICENSE` with the same folder structure.
3. Commit. YAML front matter at the top of this `README.md` selects `sdk: static` and `app_file: index.html`.
4. Visit the deployed Space and verify that class filters, preprocessing controls and Quinsh plot respond.

## Deploy to Render (Static Site)

1. Push the website files to a GitHub repository (prefer a new `resucn-research-lab` repo, or place them inside a dedicated folder).
2. In Render select **New → Static Site**, then connect that repository.
3. Use these settings:

   | Setting | Value |
   |---|---|
   | Service type | Static Site |
   | Root directory | blank if the website is at repository root; otherwise the relative demo subfolder |
   | Build command | `echo "Static site - no build"` |
   | Publish directory | `.` |

4. Deploy. The provided `render.yaml` is an optional Blueprint alternative when the site lives at the repository root.

Both hosts serve exactly the same files, with **no inference API, backend, Docker, ONNX or model checkpoint**.

## Factual basis and research limits

| Claim | Source |
|---|---|
| Group roles and Wilbert's Quinsh contribution | Group presentation slide 2 |
| ADSGC, CIAC, WBN, Quinsh, DE-Stopping architecture | Slides 3–20 and 23 |
| `Q(x) = γ(x − δ) σ(w(x − δ)) + αx` | Slide 14 |
| Random crop, flip, color jitter (training); normalize (test); RGB mean/std | Slide 21 |
| 89.90% vs 91.45% accuracy, parameters, training time, epoch | Slide 22 |
| 50,000/10,000 images, 10 standard categories, balanced labels, 32×32 RGB | Standard CIFAR-10 dataset specification, not experimental measurements |

The interactive preprocessing lab **does not claim** that a brightness slider exactly reproduces the original stochastic ColorJitter settings. It demonstrates resizing to 32×32, a horizontal flip, relative brightness and per-channel normalization from a user-selected pixel. The class explorer shows label information, not ground-truth photos or inferred predictions. **No ablation studies are claimed** and the aggregate group metrics do not measure Quinsh separately.

## Source and contributions

| Component | Contributor |
|---|---|
| Adaptive Dynamic-Scale Gated Convolution (ADSGC) | Derol Chong Chun Kit |
| Channel Importance Assignment Convolution (CIAC) | Edward Ooi Wee Xue |
| Weighted BatchNorm (WBN) | Wang XinYi |
| **Quinsh activation function** | **Wilbert Andrew Yonathan** |
| Energy–Entropy stopping (DE-Stopping) | Chua Kian Hoong |
| Data preprocessing and residual block integration | Siah Jie Sheng |

## Project structure

```text
resucn-cifar-research-showcase/
├── index.html
├── styles.css
├── app.js
├── README.md
├── render.yaml
├── LICENSE
├── assets/
│   └── favicon.svg
└── docs/
    └── SOURCE_NOTES.md
```

## License

MIT for this static website. The group's original code, model and research remain attributed to their respective contributors; see the source GitHub repository.
