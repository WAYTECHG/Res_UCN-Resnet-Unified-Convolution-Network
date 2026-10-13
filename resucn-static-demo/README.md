---
title: Res UCN Research Lab
emoji: 🧠
colorFrom: blue
colorTo: purple
sdk: static
app_file: index.html
pinned: false
license: mit
short_description: Interactive Res_UCN architecture and Quinsh activation research demo
---

# Res_UCN — Interactive Research Lab

A **fully static**, responsive, research-focused portfolio website for the AIT301 group project **ResNet Unified Convolutional Network (Res_UCN)**. It highlights **Quinsh**, the activation function contributed by **Wilbert Andrew Yonathan**, without claiming that he implemented all five research components.

**Source research:** [Res_UCN repository](https://github.com/WAYTECHG/Res_UCN-Resnet-Unified-Convolution-Network). The app is an explanatory exhibit; it is not a replacement for the original trained notebook.

## Navigation updates (v2)

- Sidebar links scroll directly to the intended section heading rather than using stacked CSS anchor offsets.
- Active navigation follows the selected section while smooth-scrolling and updates correctly when scrolling manually.
- Unified inline SVG icons, visible keyboard focus indicators, and `aria-current` for the active section.
- Mobile menu includes a dimmed backdrop, close button, Escape-to-close, and scroll locking.
- Deep links and browser back/forward retain section navigation.
- Versioned stylesheet and script URLs help browsers fetch the new files after redeployment.

## What works without a backend

- An interactive model architecture inspector with four residual stages.
- A **live Quinsh equation graph** with four editable parameters (γ, δ, α, w), presets, and output/derivative views against ReLU and Swish.
- A five-component explorer that credits each team member.
- Reported CIFAR-10 metrics (91.45% vs 89.90% accuracy; ~3.4M vs ~11.2M parameters; 17m17s vs 24m training time).
- An **optional** client-side ONNX Runtime Web inference panel with image uploads and CIFAR-10 predictions once a **compatible trained ONNX checkpoint** is supplied.

> **Evidence boundary:** No ablation study is included. The reported performance belongs to the **combined group model**, not to Quinsh in isolation. The interactive curves are illustrative mathematical plots, not learned weights. **There are no generated/fabricated classification results.**

## Deploy to Hugging Face Spaces — free static Space

1. Create a new Hugging Face **Space** and choose **Static** as the SDK (not Docker or Gradio).
2. Upload `index.html`, `styles.css`, `app.js`, `README.md`, and the entire `assets` folder, keeping the paths exactly as in this ZIP.
3. Commit changes. The `README.md` YAML header sets `sdk: static` and `app_file: index.html`.
4. Open the Space website. All educational controls work instantly and do **not** require server inference.

> If your Space UI does not offer Static as a creation option, create the Space with a README that contains the YAML header above or change the YAML via the Files tab, then add the files.

## Deploy to Render — free static site

1. Push these demo files into a **new GitHub repository** or a dedicated `resucn-demo/` subfolder of an existing repository.
2. Render Dashboard → **New** → **Static Site** → connect the repository.
3. Enter:

   | Setting | Value |
   |---|---|
   | Name | `resucn-research-lab` (or any available name) |
   | Root Directory | Leave empty if files are at the repository root; otherwise use the subfolder |
   | Build Command | `echo "Static site — no build"` |
   | Publish Directory | `.` |

4. Deploy. Alternatively, `render.yaml` defines a Render static-site blueprint for files in the root.

No API service, CPU container, Python dependencies, Docker image, or server is needed for these two static deployments.

## Run locally

Open `index.html` in a modern browser for the architecture, module cards, results, and Quinsh Studio. For the optional ONNX inference runner, serve the folder locally for best browser compatibility:

```powershell
cd path\to\resucn-demo
python -m http.server 8080
```

Visit `http://localhost:8080`.

## Enable optional real inference

The GitHub repository publishes a Jupyter notebook but does **not** currently publish a verified trained ONNX checkpoint. This ZIP intentionally does **not** contain a simulated classifier.

1. In the original Res_UCN training notebook, recreate the trained model architecture and **load the actual best-validation checkpoint** (e.g., the saved `.pt` file). Confirm the code and weights match and the model produces 10 CIFAR-10 logits.
2. With your model object (`model`) loaded in memory in eval mode, run this extra notebook cell:

   ```python
   import torch
   model.eval()
   dummy = torch.randn(1, 3, 32, 32, device=next(model.parameters()).device)
   torch.onnx.export(
       model, dummy, 'res_ucn_cifar10.onnx',
       export_params=True, opset_version=17,
       input_names=['image'], output_names=['logits'],
       dynamic_axes={'image': {0: 'batch'}, 'logits': {0: 'batch'}},
       dynamo=False,
   )
   ```

   This assumes you already have the model object from the notebook. It does not create weights or retrain anything. **Export can fail on unsupported custom operations** and must be verified against the PyTorch output on real examples. Install `onnx` if required.
3. In the website's **Model Runner**, choose the ONNX file from your computer, then choose a picture. The website loads ONNX Runtime Web on demand, preprocesses images to `[1,3,32,32]` using the slide's mean/std (mean `[.49,.48,.44]`, std `[.20,.19,.20]`), and executes inference **locally in the browser**.
4. **Verify outputs** by comparing several examples with the notebook's original PyTorch predictions. Label/order is the standard CIFAR-10 class order: `airplane, automobile, bird, cat, deer, dog, frog, horse, ship, truck`. If your notebook used a different mapping, update `CIFAR10` in `app.js`.

**Note:** ONNX Runtime is dynamically retrieved from a public CDN only when Run is clicked. An Internet connection is needed for the ONNX runtime on first use. WebGL/WebGPU is **not** required; WASM is used. Files stay in the browser; no inference requests are sent to a server. For large checkpoints, inference may be slow on phones.

## How we handle evidence and attribution

Sources:
- *AIT301 Group 2 — Final Project Slide* (2025), pages 2–3, 12–14, 20–24.
- [Res_UCN GitHub repository and notebook](https://github.com/WAYTECHG/Res_UCN-Resnet-Unified-Convolution-Network).

Group roles from the presentation:

| Research contribution | Contributor |
|---|---|
| Adaptive Dynamic-Scale Gated Convolution (ADSGC) | Derol Chong Chun Kit |
| Channel Importance Assignment Convolution (CIAC) | Edward Ooi Wee Xue |
| Weighted Batch Normalization | Wang XinYi |
| **Quinsh activation** | **Wilbert Andrew Yonathan** |
| Energy–Entropy Stopping | Chua Kian Hoong |
| Data preprocessing and residual block integration | Siah Jie Sheng |

**Important:** Features such as parameter presets, gradient plotting, static UI layouts and module visualizations are explanatory *website* functionality; they are not reported novel experiments, learned parameter estimates or ablation studies.

## Project structure

```text
resucn-demo/
├── index.html          # entire static application
├── styles.css          # responsive dark research-lab design
├── app.js              # charts, modules, nav, optional ONNX runner
├── README.md           # documentation and Hugging Face static metadata
├── render.yaml         # optional Render static-site Blueprint
├── assets/
│   └── favicon.svg
└── docs/
    └── SOURCE_NOTES.md
```

## Licence

Demo application is provided under the MIT License. Original research and notebook: see [upstream repository](https://github.com/WAYTECHG/Res_UCN-Resnet-Unified-Convolution-Network) for project attribution and licensing.
