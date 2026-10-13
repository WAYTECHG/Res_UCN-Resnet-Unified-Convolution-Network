# Grounding and limitations

Reference: *AIT301 Group 2 Final Project Slide*, 2025 (provided by the project team) and the public Res_UCN GitHub README.

- Slide 2: individual team responsibility. Wilbert Andrew Yonathan contributed **Quinsh**, not all group mechanisms.
- Slides 3, 20: block-level architecture, shortcut descriptions.
- Slides 4–6: ADSGC local vs dilated/wider context motivation.
- Slides 7–9: channel importance using GAP, normalization, temperature, sigmoid.
- Slides 10–11: weighted batch normalization and Gaussian outlier weighting.
- Slides 12–14: Quinsh exact formula γ (x−δ) σ(w (x−δ)) + αx and motivations.
- Slides 15–19: energy-entropy early stopping, halting threshold 0.55.
- Slide 21: CIFAR-10 preprocessing, mean (.49, .48, .44), standard deviations (.20, .19, .20).
- Slide 22: 89.90% vs 91.45%; 24 min vs 17min17s; ~11.2M vs ~3.4M parameters; best epoch 18.
- Slide 23: five research mechanisms, CIFAR-10 use.
- Slide 24: limits include compute resources, external validation unperformed, model interpretability improvements proposed.
- GitHub README: four stages of 64,128,256,256 filters; pooled classifier, dropout 0.5; original notebook availability.

No ablation, cross-dataset robustness claims, measured interpretability/Grad-CAM output, or synthetic classification outputs are represented as experiments in this demo.

- CIFAR-10 Lab displays ten standard CIFAR-10 category labels and counts (50,000 training / 10,000 test; 5,000 train and 1,000 test per class), known from the public dataset specification; these values are not measured in the team's experiment.
- Animal/vehicle categorization and icon illustrations are explanation-only. Emoji drawings are NOT images from CIFAR-10.
- The preprocessing simulator uses concept drawings or a locally supplied image. Its brightness control demonstrates a related adjustment, not exact original augmentation hyperparameters. Numeric values are computed from the rendered 32×32 pixels and slide 21 normalization statistics.
- The ONNX model runner was removed: this website does not perform real classification or make up any predictions.

**Activation chart presets** were selected for comprehensibility; no claim is made that the original model learned those displayed parameters.
