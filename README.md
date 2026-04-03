# Res_UCN-Resnet Unified Convolution Network

### Novel Deep Learning Architecture for Efficient Image Classification

Res-UCN is a research-oriented deep learning model based on the Residual Network (ResNet) philosophy. It introduces five major novelty algorithms designed to optimize feature extraction, improve gradient flow, and significantly reduce the total parameter count while maintaining high accuracy.

---

## 🚀 Key Novelties

### 1. DE-Stopping (Weighted Energy-Entropy Stopping)
A custom halting mechanism that goes beyond traditional validation loss monitoring. It calculates a **Halting Probability ($h$)** using:
* **Energy (LogSumExp):** Measures the confidence magnitude of the logits.
* **Tsallis Entropy:** Measures the "sharpness" of the prediction distribution.

The model stops only when it is both stuck (loss plateau) and confident ($h > threshold$), preventing premature stopping during volatile training phases.

### 2. Weighted BatchNorm2d (WBN)
A robust alternative to standard Batch Normalization. It uses a **Gaussian Kernel** to assign weights to pixels during mean and variance calculation.
* **Effect:** Reduces the influence of outliers within a batch, leading to more stable "robust statistics" and smoother convergence.

### 3. Quinsh Activation Layer
A novel, parametric activation function defined as:
$$y = \gamma \cdot (x_{shifted} \cdot \sigma(w \cdot x_{shifted})) + \alpha \cdot x$$
* **Features:** Learnable shifting ($\delta$), gating ($w$), and a residual linear path ($\alpha$). 
* **Benefit:** Allows the model to dynamically balance non-linear transformation and linear signal propagation, effectively solving the "Dead ReLU" problem.

### 4. Adaptive Dynamic-Scale Gated Convolution (ADSGC)
Extends the receptive field without increasing parameters.
* It combines a standard 3x3 kernel with a **dilated 3x3 kernel** (dilation=2, effectively 5x5).
* A **Gate Predictor** uses global average pooling to decide the optimal balance ($\lambda$) between local and wide context for every input.

### 5. Channel Importance Assignment Convolution (CIAC)
An attention-based convolution layer that performs channel-wise re-weighting before the convolution operation. It uses a **learnable temperature parameter** to recalibrate feature maps based on their importance.

---

## 📊 Model Architecture Summary
The Res-UCN structure consists of four main stages, alternating between **ADSGC** and **CIAC** blocks:

1.  **Stage 1:** ADSGC $\rightarrow$ CIAC $\rightarrow$ MaxPool (64 filters)
2.  **Stage 2:** ADSGC $\rightarrow$ CIAC $\rightarrow$ MaxPool (128 filters)
3.  **Stage 3:** ADSGC $\rightarrow$ CIAC $\rightarrow$ MaxPool (256 filters)
4.  **Stage 4:** ADSGC $\rightarrow$ CIAC $\rightarrow$ MaxPool (256 filters)
5.  **Head:** Global Average Pooling $\rightarrow$ Dropout (0.5) $\rightarrow$ Fully Connected (10 classes)

---

## 📈 Performance Results (CIFAR-10)
* **Best Accuracy:** 91.45% (A +1.55% improvement over baseline).
* **Parameter Reduction:** ~69% fewer parameters compared to standard ResNet-18.
* **Efficiency:** Accelerated convergence (approx. 28% faster training time).

---

## 🛠️ Usage

### Prerequisites
* PyTorch 2.0+
* Torchvision
* NumPy / Matplotlib

### Training & Evaluation
The training script automatically detects CUDA and saves record files for analysis:
* `Res_UCN_Record.pt`: Stores model weights and loss/accuracy history.
* `Res_UCN_ES_Record.pt`: Stores Energy and Entropy metrics for visualization.

---
**Author:** Wilbert Andrew Yonathan, Chua Kian Hoong, Edward Ooi Wee Xue, Derol Chong Chung Kit, Wang Xinyi, Siah Jieh Sheng  
