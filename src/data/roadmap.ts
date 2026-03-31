'use client';

export interface Resource {
  title: string;
  type: 'course' | 'book' | 'paper' | 'repo' | 'video' | 'tool' | 'docs' | 'blog';
  url: string;
  free: boolean;
  estimatedHours: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  resources: Resource[];
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Topic {
  id: string;
  title: string;
  weekNumber: number;
  tasks: Task[];
  milestone?: string;
}

export interface Phase {
  id: string;
  title: string;
  months: string;
  description: string;
  colorScheme: 'blue' | 'purple' | 'teal' | 'green' | 'orange' | 'pink';
  topics: Topic[];
  capstoneProject: string;
}

export const phases: Phase[] = [
  {
    id: 'phase-1',
    title: 'Foundations',
    months: 'Months 1–2',
    description: 'Build the mathematical and programming foundations for machine learning.',
    colorScheme: 'blue',
    topics: [
      {
        id: 'topic-1-1',
        title: 'Python for Data Science',
        weekNumber: 1,
        tasks: [
          {
            id: 'task-1-1-1',
            title: 'Complete Python Crash Course chapters 1–8',
            description: 'Work through fundamentals of Python programming including variables, data types, control flow, and functions.',
            estimatedMinutes: 60,
            resources: [
              { title: 'Python Crash Course', type: 'book', url: 'https://nostarch.com/pythoncrashcourse2e', free: false, estimatedHours: 20 },
              { title: 'Real Python Tutorials', type: 'course', url: 'https://realpython.com', free: true, estimatedHours: 15 }
            ],
            tags: ['python', 'programming'],
            difficulty: 'beginner'
          },
          {
            id: 'task-1-1-2',
            title: 'NumPy in 1 hour — array operations, broadcasting',
            description: 'Learn NumPy array operations, vectorization, and broadcasting for efficient numerical computing.',
            estimatedMinutes: 60,
            resources: [
              { title: 'NumPy Official Quickstart', type: 'docs', url: 'https://numpy.org/doc/stable/user/quickstart.html', free: true, estimatedHours: 2 },
              { title: 'CS231n NumPy Tutorial', type: 'course', url: 'https://cs231n.github.io/python-numpy-tutorial/', free: true, estimatedHours: 2 }
            ],
            tags: ['numpy', 'data-science'],
            difficulty: 'beginner'
          },
          {
            id: 'task-1-1-3',
            title: 'Pandas fundamentals — DataFrames, groupby, merge',
            description: 'Master Pandas DataFrame operations, grouping, merging, and data manipulation.',
            estimatedMinutes: 90,
            resources: [
              { title: '10 minutes to pandas', type: 'docs', url: 'https://pandas.pydata.org/docs/user_guide/10min.html', free: true, estimatedHours: 1 },
              { title: 'Kaggle Pandas Course', type: 'course', url: 'https://www.kaggle.com/learn/pandas', free: true, estimatedHours: 4 }
            ],
            tags: ['pandas', 'data-science'],
            difficulty: 'beginner'
          }
        ],
        milestone: 'EDA on Titanic dataset'
      },
      {
        id: 'topic-1-2',
        title: 'Linear Algebra for ML',
        weekNumber: 3,
        tasks: [
          {
            id: 'task-1-2-1',
            title: 'Gilbert Strang MIT 18.06 — Lectures 1–6',
            description: 'Learn vectors, matrices, and fundamental linear algebra concepts for ML.',
            estimatedMinutes: 90,
            resources: [
              { title: 'MIT OCW 18.06SC', type: 'course', url: 'https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/', free: true, estimatedHours: 12 },
              { title: '3Blue1Brown Essence of Linear Algebra', type: 'video', url: 'https://www.3blue1brown.com/topics/linear-algebra', free: true, estimatedHours: 4 }
            ],
            tags: ['math', 'linear-algebra'],
            difficulty: 'intermediate'
          },
          {
            id: 'task-1-2-2',
            title: 'Implement matrix multiplication from scratch in NumPy',
            description: 'Build your own matrix multiplication function to understand the underlying math.',
            estimatedMinutes: 60,
            resources: [
              { title: 'Matrix Calculus for ML', type: 'paper', url: 'https://arxiv.org/abs/1802.01528', free: true, estimatedHours: 3 }
            ],
            tags: ['math', 'numpy'],
            difficulty: 'intermediate'
          },
          {
            id: 'task-1-2-3',
            title: 'Eigenvalues and SVD — intuition + implementation',
            description: 'Understand eigenvalue decomposition and singular value decomposition with practical implementation.',
            estimatedMinutes: 60,
            resources: [
              { title: 'Visual explanation of SVD', type: 'video', url: 'https://www.youtube.com/watch?v=vSczTbgc8Rc', free: true, estimatedHours: 1 }
            ],
            tags: ['math', 'linear-algebra'],
            difficulty: 'intermediate'
          }
        ]
      },
      {
        id: 'topic-1-3',
        title: 'Statistics & Probability',
        weekNumber: 5,
        tasks: [
          {
            id: 'task-1-3-1',
            title: 'Probability distributions with scipy.stats',
            description: 'Learn normal, binomial, and Poisson distributions with practical Python examples.',
            estimatedMinutes: 60,
            resources: [
              { title: 'Think Stats', type: 'book', url: 'https://greenteapress.com/thinkstats2/html/index.html', free: true, estimatedHours: 15 },
              { title: 'StatQuest Statistics Playlist', type: 'video', url: 'https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9', free: true, estimatedHours: 4 }
            ],
            tags: ['math', 'statistics'],
            difficulty: 'intermediate'
          },
          {
            id: 'task-1-3-2',
            title: 'Hypothesis testing, p-values, confidence intervals',
            description: 'Master statistical hypothesis testing, p-values, and confidence interval interpretation.',
            estimatedMinutes: 60,
            resources: [
              { title: 'StatQuest Hypothesis Testing', type: 'video', url: 'https://www.youtube.com/watch?v=0oc49DyA3hU', free: true, estimatedHours: 1 }
            ],
            tags: ['math', 'statistics'],
            difficulty: 'intermediate'
          },
          {
            id: 'task-1-3-3',
            title: 'Bayes theorem from first principles',
            description: 'Derive Bayes theorem from scratch and apply it to real-world problems.',
            estimatedMinutes: 45,
            resources: [
              { title: '3Blue1Brown Bayes', type: 'video', url: 'https://www.youtube.com/watch?v=HZGCoVF3YvM', free: true, estimatedHours: 0.5 }
            ],
            tags: ['math', 'probability'],
            difficulty: 'beginner'
          }
        ]
      },
      {
        id: 'topic-1-4',
        title: 'Calculus for ML',
        weekNumber: 7,
        tasks: [
          {
            id: 'task-1-4-1',
            title: 'Derivatives, chain rule, partial derivatives',
            description: 'Learn differential calculus fundamentals essential for understanding gradient-based optimization.',
            estimatedMinutes: 60,
            resources: [
              { title: '3Blue1Brown Calculus Series', type: 'video', url: 'https://www.3blue1brown.com/topics/calculus', free: true, estimatedHours: 3 },
              { title: 'Khan Academy Multivariable Calculus', type: 'course', url: 'https://www.khanacademy.org/math/multivariable-calculus', free: true, estimatedHours: 10 }
            ],
            tags: ['math', 'calculus'],
            difficulty: 'intermediate'
          },
          {
            id: 'task-1-4-2',
            title: 'Implement gradient descent from scratch',
            description: 'Code gradient descent algorithm from scratch to understand optimization fundamentals.',
            estimatedMinutes: 90,
            resources: [
              { title: 'Andrew Ng Gradient Descent', type: 'course', url: 'https://www.coursera.org/learn/machine-learning', free: true, estimatedHours: 5 }
            ],
            tags: ['math', 'optimization'],
            difficulty: 'intermediate'
          }
        ],
        milestone: 'Exploratory data analysis on Titanic dataset'
      }
    ],
    capstoneProject: 'Exploratory data analysis on the Titanic dataset — clean, visualize, summarize in a Jupyter notebook'
  },
  {
    id: 'phase-2',
    title: 'Classical ML',
    months: 'Months 3–4',
    description: 'Master traditional machine learning algorithms and the scikit-learn workflow.',
    colorScheme: 'purple',
    topics: [
      {
        id: 'topic-2-1',
        title: 'Scikit-learn & ML Workflow',
        weekNumber: 9,
        tasks: [
          {
            id: 'task-2-1-1',
            title: 'Andrew Ng ML Specialization — Course 1 weeks 1–3',
            description: 'Learn linear and logistic regression with machine learning fundamentals.',
            estimatedMinutes: 120,
            resources: [
              { title: 'Coursera ML Specialization', type: 'course', url: 'https://www.coursera.org/specializations/machine-learning-introduction', free: true, estimatedHours: 40 },
              { title: 'Sklearn User Guide', type: 'docs', url: 'https://scikit-learn.org/stable/user_guide.html', free: true, estimatedHours: 10 }
            ],
            tags: ['machine-learning', 'sklearn'],
            difficulty: 'intermediate'
          },
          {
            id: 'task-2-1-2',
            title: 'Feature engineering — encoding, scaling, imputation',
            description: 'Learn essential feature engineering techniques for preprocessing ML data.',
            estimatedMinutes: 60,
            resources: [
              { title: 'Sklearn Preprocessing', type: 'docs', url: 'https://scikit-learn.org/stable/modules/preprocessing.html', free: true, estimatedHours: 3 },
              { title: 'Feature Engineering for ML', type: 'book', url: 'https://www.oreilly.com/library/view/feature-engineering-for/9781491953235/', free: false, estimatedHours: 10 }
            ],
            tags: ['machine-learning', 'feature-engineering'],
            difficulty: 'intermediate'
          },
          {
            id: 'task-2-1-3',
            title: 'Train/val/test splits, cross-validation, overfitting',
            description: 'Understand proper data splitting and cross-validation techniques to prevent overfitting.',
            estimatedMinutes: 60,
            resources: [
              { title: 'Sklearn Cross-Validation Docs', type: 'docs', url: 'https://scikit-learn.org/stable/modules/cross_validation.html', free: true, estimatedHours: 2 }
            ],
            tags: ['machine-learning', 'validation'],
            difficulty: 'intermediate'
          }
        ]
      },
      {
        id: 'topic-2-2',
        title: 'Supervised Learning',
        weekNumber: 11,
        tasks: [
          {
            id: 'task-2-2-1',
            title: 'Decision trees and random forests — intuition + sklearn',
            description: 'Learn tree-based ensemble methods for classification and regression.',
            estimatedMinutes: 90,
            resources: [
              { title: 'Sklearn Ensemble Methods', type: 'docs', url: 'https://scikit-learn.org/stable/modules/ensemble.html', free: true, estimatedHours: 5 },
              { title: 'StatQuest Random Forests', type: 'video', url: 'https://www.youtube.com/watch?v=J4Wdy0Wc_xQ', free: true, estimatedHours: 1 }
            ],
            tags: ['machine-learning', 'ensemble'],
            difficulty: 'intermediate'
          },
          {
            id: 'task-2-2-2',
            title: 'SVMs and kernel trick',
            description: 'Understand support vector machines and the kernel trick for non-linear classification.',
            estimatedMinutes: 60,
            resources: [
              { title: 'StatQuest SVM', type: 'video', url: 'https://www.youtube.com/watch?v=efR1C6CvhmE', free: true, estimatedHours: 1 }
            ],
            tags: ['machine-learning', 'svm'],
            difficulty: 'advanced'
          },
          {
            id: 'task-2-2-3',
            title: 'Gradient boosting — XGBoost and LightGBM',
            description: 'Master gradient boosting algorithms for tabular data competitions and production.',
            estimatedMinutes: 90,
            resources: [
              { title: 'XGBoost Docs', type: 'docs', url: 'https://xgboost.readthedocs.io/en/stable/tutorials/model.html', free: true, estimatedHours: 5 },
              { title: 'LightGBM Docs', type: 'docs', url: 'https://lightgbm.readthedocs.io/en/stable/', free: true, estimatedHours: 4 }
            ],
            tags: ['machine-learning', 'gradient-boosting'],
            difficulty: 'intermediate'
          }
        ]
      },
      {
        id: 'topic-2-3',
        title: 'Unsupervised Learning',
        weekNumber: 13,
        tasks: [
          {
            id: 'task-2-3-1',
            title: 'K-Means clustering — theory + sklearn implementation',
            description: 'Learn clustering algorithms and their practical applications.',
            estimatedMinutes: 60,
            resources: [
              { title: 'Sklearn Clustering Comparison', type: 'docs', url: 'https://scikit-learn.org/stable/modules/clustering.html', free: true, estimatedHours: 3 }
            ],
            tags: ['machine-learning', 'clustering'],
            difficulty: 'intermediate'
          },
          {
            id: 'task-2-3-2',
            title: 'PCA — dimensionality reduction with a real dataset',
            description: 'Apply principal component analysis for dimensionality reduction and visualization.',
            estimatedMinutes: 60,
            resources: [
              { title: 'Sklearn PCA Tutorial', type: 'docs', url: 'https://scikit-learn.org/stable/modules/decomposition.html', free: true, estimatedHours: 2 }
            ],
            tags: ['machine-learning', 'dimensionality-reduction'],
            difficulty: 'intermediate'
          }
        ],
        milestone: 'Kaggle Titanic competition submission'
      }
    ],
    capstoneProject: 'Kaggle Titanic competition submission — target >78% accuracy'
  },
  {
    id: 'phase-3',
    title: 'Deep Learning',
    months: 'Months 5–6',
    description: 'Build deep neural networks from scratch and master PyTorch for production ML.',
    colorScheme: 'teal',
    topics: [
      {
        id: 'topic-3-1',
        title: 'Neural Networks from Scratch',
        weekNumber: 15,
        tasks: [
          {
            id: 'task-3-1-1',
            title: 'fast.ai Practical Deep Learning — Lesson 1–3',
            description: 'Train your first neural network using the fast.ai approach.',
            estimatedMinutes: 120,
            resources: [
              { title: 'fast.ai Course', type: 'course', url: 'https://course.fast.ai', free: true, estimatedHours: 15 },
              { title: 'fast.ai Book', type: 'book', url: 'https://github.com/fastai/fastbook', free: true, estimatedHours: 20 }
            ],
            tags: ['deep-learning', 'pytorch'],
            difficulty: 'intermediate'
          },
          {
            id: 'task-3-1-2',
            title: 'Implement a 2-layer neural net with backprop in NumPy',
            description: 'Build a neural network from scratch without frameworks to understand the mechanics.',
            estimatedMinutes: 120,
            resources: [
              { title: 'Andrej Karpathy micrograd', type: 'repo', url: 'https://github.com/karpathy/micrograd', free: true, estimatedHours: 5 },
              { title: 'Neural Networks: Zero to Hero', type: 'video', url: 'https://karpathy.ai/zero-to-hero.html', free: true, estimatedHours: 10 }
            ],
            tags: ['deep-learning', 'neural-networks'],
            difficulty: 'advanced'
          },
          {
            id: 'task-3-1-3',
            title: 'Activation functions — ReLU, sigmoid, tanh, softmax',
            description: 'Understand why different activation functions matter and when to use each.',
            estimatedMinutes: 45,
            resources: [
              { title: 'CS231n Notes on Activation Functions', type: 'course', url: 'https://cs231n.github.io/neural-networks-1/', free: true, estimatedHours: 2 }
            ],
            tags: ['deep-learning', 'activation-functions'],
            difficulty: 'intermediate'
          }
        ]
      },
      {
        id: 'topic-3-2',
        title: 'PyTorch',
        weekNumber: 17,
        tasks: [
          {
            id: 'task-3-2-1',
            title: 'PyTorch in 60 minutes blitz — tensors, autograd, nn.Module',
            description: 'Get up to speed with PyTorch fundamentals in one hour.',
            estimatedMinutes: 90,
            resources: [
              { title: 'PyTorch 60 min Blitz', type: 'course', url: 'https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html', free: true, estimatedHours: 1 }
            ],
            tags: ['deep-learning', 'pytorch'],
            difficulty: 'beginner'
          },
          {
            id: 'task-3-2-2',
            title: 'Build an image classifier with PyTorch on CIFAR-10',
            description: 'Train a CNN classifier on the CIFAR-10 image dataset.',
            estimatedMinutes: 120,
            resources: [
              { title: 'PyTorch CIFAR Tutorial', type: 'course', url: 'https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html', free: true, estimatedHours: 2 }
            ],
            tags: ['deep-learning', 'computer-vision', 'pytorch'],
            difficulty: 'intermediate'
          },
          {
            id: 'task-3-2-3',
            title: 'Training loop, loss, optimizer — write it from scratch',
            description: 'Implement a complete training loop with loss functions and optimizers.',
            estimatedMinutes: 90,
            resources: [
              { title: 'PyTorch Tutorials', type: 'course', url: 'https://pytorch.org/tutorials/', free: true, estimatedHours: 10 }
            ],
            tags: ['deep-learning', 'pytorch', 'training'],
            difficulty: 'intermediate'
          }
        ]
      },
      {
        id: 'topic-3-3',
        title: 'CNNs',
        weekNumber: 19,
        tasks: [
          {
            id: 'task-3-3-1',
            title: 'Convolutional neural networks — filters, pooling, receptive field',
            description: 'Understand CNN architecture components and how they process images.',
            estimatedMinutes: 90,
            resources: [
              { title: 'CS231n CNN Lecture', type: 'course', url: 'https://cs231n.github.io/convolutional-networks/', free: true, estimatedHours: 5 },
              { title: '3Blue1Brown What is a Neural Network', type: 'video', url: 'https://www.youtube.com/watch?v=aircAruvnKk', free: true, estimatedHours: 1 }
            ],
            tags: ['deep-learning', 'computer-vision', 'cnn'],
            difficulty: 'intermediate'
          },
          {
            id: 'task-3-3-2',
            title: 'Transfer learning with ResNet on a custom dataset',
            description: 'Apply transfer learning using a pretrained ResNet on your own dataset.',
            estimatedMinutes: 120,
            resources: [
              { title: 'PyTorch Transfer Learning Tutorial', type: 'course', url: 'https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html', free: true, estimatedHours: 3 }
            ],
            tags: ['deep-learning', 'computer-vision', 'transfer-learning'],
            difficulty: 'intermediate'
          }
        ],
        milestone: 'Train a CNN classifier on a dataset of your choice'
      }
    ],
    capstoneProject: 'Train a CNN classifier on a dataset of your choice — deploy it as a Hugging Face Space'
  },
  {
    id: 'phase-4',
    title: 'NLP & Transformers',
    months: 'Months 7–8',
    description: 'Master natural language processing and transformer architectures.',
    colorScheme: 'green',
    topics: [
      {
        id: 'topic-4-1',
        title: 'NLP Fundamentals',
        weekNumber: 21,
        tasks: [
          {
            id: 'task-4-1-1',
            title: 'Text preprocessing — tokenization, stemming, TF-IDF',
            description: 'Learn essential text preprocessing techniques for NLP tasks.',
            estimatedMinutes: 60,
            resources: [
              { title: 'NLTK Book', type: 'book', url: 'https://www.nltk.org/book/', free: true, estimatedHours: 10 },
              { title: 'spaCy 101', type: 'course', url: 'https://spacy.io/usage/spacy-101', free: true, estimatedHours: 3 }
            ],
            tags: ['nlp', 'text-processing'],
            difficulty: 'beginner'
          },
          {
            id: 'task-4-1-2',
            title: 'Word embeddings — Word2Vec, GloVe intuition',
            description: 'Understand word embedding methods and their applications.',
            estimatedMinutes: 60,
            resources: [
              { title: 'CS224n Notes on Word Vectors', type: 'course', url: 'https://web.stanford.edu/class/cs224n/', free: true, estimatedHours: 5 },
              { title: 'Illustrated Word2Vec', type: 'course', url: 'https://jalammar.github.io/illustrated-word2vec/', free: true, estimatedHours: 1 }
            ],
            tags: ['nlp', 'embeddings'],
            difficulty: 'intermediate'
          }
        ]
      },
      {
        id: 'topic-4-2',
        title: 'Transformers & LLMs',
        weekNumber: 23,
        tasks: [
          {
            id: 'task-4-2-1',
            title: 'Attention mechanism — read the original Attention Is All You Need paper',
            description: 'Read the foundational transformer paper that started the revolution.',
            estimatedMinutes: 90,
            resources: [
              { title: 'Attention Is All You Need', type: 'paper', url: 'https://arxiv.org/abs/1706.03762', free: true, estimatedHours: 4 },
              { title: 'The Illustrated Transformer', type: 'course', url: 'https://jalammar.github.io/illustrated-transformer/', free: true, estimatedHours: 2 }
            ],
            tags: ['nlp', 'transformers', 'attention'],
            difficulty: 'advanced'
          },
          {
            id: 'task-4-2-2',
            title: 'Hugging Face transformers library — pipelines, tokenizers, fine-tuning',
            description: 'Master the Hugging Face ecosystem for working with transformer models.',
            estimatedMinutes: 120,
            resources: [
              { title: 'HuggingFace Course', type: 'course', url: 'https://huggingface.co/learn/nlp-course/chapter1/1', free: true, estimatedHours: 20 },
              { title: 'HF Docs', type: 'docs', url: 'https://huggingface.co/docs/transformers/index', free: true, estimatedHours: 10 }
            ],
            tags: ['nlp', 'huggingface', 'transformers'],
            difficulty: 'intermediate'
          },
          {
            id: 'task-4-2-3',
            title: 'Fine-tune BERT for text classification',
            description: 'Fine-tune a BERT model for a specific text classification task.',
            estimatedMinutes: 120,
            resources: [
              { title: 'HF Fine-tuning Guide', type: 'docs', url: 'https://huggingface.co/docs/transformers/training', free: true, estimatedHours: 3 }
            ],
            tags: ['nlp', 'bert', 'fine-tuning'],
            difficulty: 'advanced'
          },
          {
            id: 'task-4-2-4',
            title: 'Prompt engineering for LLMs',
            description: 'Learn effective prompt engineering techniques for large language models.',
            estimatedMinutes: 60,
            resources: [
              { title: 'Prompt Engineering Guide', type: 'course', url: 'https://www.promptingguide.ai', free: true, estimatedHours: 3 }
            ],
            tags: ['llm', 'prompt-engineering'],
            difficulty: 'beginner'
          }
        ],
        milestone: 'Fine-tune a sentiment classifier'
      }
    ],
    capstoneProject: 'Fine-tune a sentiment classifier on a domain-specific dataset and publish it to Hugging Face Hub'
  },
  {
    id: 'phase-5',
    title: 'MLOps & Production',
    months: 'Months 9–10',
    description: 'Deploy and maintain production ML systems with proper MLOps practices.',
    colorScheme: 'orange',
    topics: [
      {
        id: 'topic-5-1',
        title: 'Experiment Tracking & Reproducibility',
        weekNumber: 27,
        tasks: [
          {
            id: 'task-5-1-1',
            title: 'MLflow tracking — log experiments, compare runs',
            description: 'Set up MLflow for tracking experiments, metrics, and artifacts.',
            estimatedMinutes: 90,
            resources: [
              { title: 'MLflow Quickstart', type: 'docs', url: 'https://mlflow.org/docs/latest/getting-started/intro-quickstart/index.html', free: true, estimatedHours: 2 }
            ],
            tags: ['mlops', 'experiment-tracking'],
            difficulty: 'beginner'
          },
          {
            id: 'task-5-1-2',
            title: 'DVC for data versioning',
            description: 'Learn data version control with DVC for reproducible ML pipelines.',
            estimatedMinutes: 60,
            resources: [
              { title: 'DVC Tutorial', type: 'docs', url: 'https://dvc.org/doc/start', free: true, estimatedHours: 3 }
            ],
            tags: ['mlops', 'data-versioning'],
            difficulty: 'intermediate'
          },
          {
            id: 'task-5-1-3',
            title: 'W&B (Weights & Biases) — sweeps and dashboards',
            description: 'Use W&B for experiment tracking, hyperparameter optimization, and visualization.',
            estimatedMinutes: 90,
            resources: [
              { title: 'W&B Quickstart', type: 'docs', url: 'https://docs.wandb.ai/quickstart', free: true, estimatedHours: 2 }
            ],
            tags: ['mlops', 'experiment-tracking'],
            difficulty: 'beginner'
          }
        ]
      },
      {
        id: 'topic-5-2',
        title: 'Model Deployment',
        weekNumber: 29,
        tasks: [
          {
            id: 'task-5-2-1',
            title: 'FastAPI REST API to serve a model',
            description: 'Build a REST API using FastAPI to serve your ML model.',
            estimatedMinutes: 120,
            resources: [
              { title: 'FastAPI ML Serving Tutorial', type: 'course', url: 'https://fastapi.tiangolo.com/tutorial/', free: true, estimatedHours: 5 },
              { title: 'Full Stack FastAPI Template', type: 'repo', url: 'https://github.com/fastapi/full-stack-fastapi-template', free: true, estimatedHours: 10 }
            ],
            tags: ['mlops', 'fastapi', 'deployment'],
            difficulty: 'intermediate'
          },
          {
            id: 'task-5-2-2',
            title: 'Docker container for your ML model',
            description: 'Package your ML model in a Docker container for consistent deployment.',
            estimatedMinutes: 90,
            resources: [
              { title: 'Docker for ML', type: 'docs', url: 'https://docs.docker.com/get-started/overview/', free: true, estimatedHours: 5 },
              { title: 'Practical MLOps Book', type: 'book', url: 'https://github.com/paiml/practical-mlops-book', free: true, estimatedHours: 15 }
            ],
            tags: ['mlops', 'docker', 'deployment'],
            difficulty: 'intermediate'
          },
          {
            id: 'task-5-2-3',
            title: 'Deploy to Hugging Face Spaces or Railway',
            description: 'Deploy your model to a free hosting platform for public access.',
            estimatedMinutes: 60,
            resources: [
              { title: 'HF Spaces Docs', type: 'docs', url: 'https://huggingface.co/docs/hub/spaces', free: true, estimatedHours: 2 }
            ],
            tags: ['mlops', 'deployment'],
            difficulty: 'beginner'
          }
        ]
      },
      {
        id: 'topic-5-3',
        title: 'Monitoring & CI/CD',
        weekNumber: 31,
        tasks: [
          {
            id: 'task-5-3-1',
            title: 'GitHub Actions CI pipeline for model tests',
            description: 'Set up automated CI/CD pipelines for testing ML models.',
            estimatedMinutes: 90,
            resources: [
              { title: 'GitHub Actions for ML', type: 'docs', url: 'https://docs.github.com/en/actions', free: true, estimatedHours: 5 }
            ],
            tags: ['mlops', 'ci-cd'],
            difficulty: 'intermediate'
          },
          {
            id: 'task-5-3-2',
            title: 'Data/model drift detection basics',
            description: 'Learn to detect data drift and model degradation in production.',
            estimatedMinutes: 60,
            resources: [
              { title: 'Evidently AI', type: 'tool', url: 'https://www.evidentlyai.com/', free: true, estimatedHours: 3 }
            ],
            tags: ['mlops', 'monitoring'],
            difficulty: 'intermediate'
          }
        ],
        milestone: 'Deploy your CNN or NLP model as a public API'
      }
    ],
    capstoneProject: 'Deploy your Phase 3 CNN or Phase 4 NLP model as a public API with a Gradio demo'
  },
  {
    id: 'phase-6',
    title: 'Specialization & Capstone',
    months: 'Months 11–12',
    description: 'Choose a specialization track and complete your final capstone project.',
    colorScheme: 'pink',
    topics: [
      {
        id: 'topic-6-1',
        title: 'Computer Vision Track',
        weekNumber: 33,
        tasks: [
          {
            id: 'task-6-1-1',
            title: 'Object detection — YOLO architecture and training',
            description: 'Learn YOLO architecture and train an object detector.',
            estimatedMinutes: 120,
            resources: [
              { title: 'Ultralytics YOLOv8 Docs', type: 'docs', url: 'https://docs.ultralytics.com', free: true, estimatedHours: 5 },
              { title: 'DETR Paper', type: 'paper', url: 'https://arxiv.org/abs/2005.12872', free: true, estimatedHours: 4 }
            ],
            tags: ['computer-vision', 'object-detection', 'yolo'],
            difficulty: 'advanced'
          },
          {
            id: 'task-6-1-2',
            title: 'Image segmentation — Segment Anything Model',
            description: 'Learn image segmentation with SAM (Segment Anything Model).',
            estimatedMinutes: 90,
            resources: [
              { title: 'SAM Paper', type: 'paper', url: 'https://arxiv.org/abs/2304.02643', free: true, estimatedHours: 3 },
              { title: 'SAM Demo', type: 'tool', url: 'https://segment-anything.com', free: true, estimatedHours: 1 }
            ],
            tags: ['computer-vision', 'segmentation', 'sam'],
            difficulty: 'advanced'
          }
        ]
      },
      {
        id: 'topic-6-2',
        title: 'NLP/LLMs Track',
        weekNumber: 33,
        tasks: [
          {
            id: 'task-6-2-1',
            title: 'RAG (Retrieval-Augmented Generation) system from scratch',
            description: 'Build a complete RAG system for question answering.',
            estimatedMinutes: 120,
            resources: [
              { title: 'LangChain RAG Tutorial', type: 'course', url: 'https://python.langchain.com/docs/tutorials/rag/', free: true, estimatedHours: 5 },
              { title: 'LlamaIndex', type: 'docs', url: 'https://docs.llamaindex.ai/en/stable/', free: true, estimatedHours: 5 }
            ],
            tags: ['nlp', 'rag', 'llm'],
            difficulty: 'advanced'
          },
          {
            id: 'task-6-2-2',
            title: 'LLM fine-tuning with LoRA/QLoRA',
            description: 'Fine-tune large language models efficiently using LoRA techniques.',
            estimatedMinutes: 120,
            resources: [
              { title: 'HF PEFT Library', type: 'docs', url: 'https://huggingface.co/docs/peft/index', free: true, estimatedHours: 5 },
              { title: 'QLoRA Paper', type: 'paper', url: 'https://arxiv.org/abs/2305.14314', free: true, estimatedHours: 4 }
            ],
            tags: ['nlp', 'llm', 'fine-tuning', 'lora'],
            difficulty: 'advanced'
          }
        ]
      },
      {
        id: 'topic-6-3',
        title: 'Tabular/Structured Data Track',
        weekNumber: 33,
        tasks: [
          {
            id: 'task-6-3-1',
            title: 'AutoML — AutoGluon and H2O.ai',
            description: 'Learn automated machine learning for tabular data.',
            estimatedMinutes: 90,
            resources: [
              { title: 'AutoGluon Docs', type: 'docs', url: 'https://auto.gluon.ai/stable/index.html', free: true, estimatedHours: 5 }
            ],
            tags: ['tabular', 'automl'],
            difficulty: 'intermediate'
          },
          {
            id: 'task-6-3-2',
            title: 'Kaggle competition strategy — feature stores, stacking',
            description: 'Learn advanced Kaggle competition techniques.',
            estimatedMinutes: 120,
            resources: [
              { title: 'Kaggle Grandmaster Notebooks', type: 'course', url: 'https://www.kaggle.com/', free: true, estimatedHours: 20 },
              { title: 'Feature Store Docs', type: 'docs', url: 'https://www.featurestore.org', free: true, estimatedHours: 5 }
            ],
            tags: ['tabular', 'kaggle', 'competition'],
            difficulty: 'advanced'
          }
        ]
      },
      {
        id: 'topic-6-4',
        title: 'Final Capstone',
        weekNumber: 37,
        tasks: [
          {
            id: 'task-6-4-1',
            title: 'Define your capstone project scope in a one-page spec',
            description: 'Write a detailed specification for your final capstone project.',
            estimatedMinutes: 60,
            resources: [
              { title: 'Cookiecutter Data Science', type: 'repo', url: 'https://cookiecutter-data-science.drivendata.org', free: true, estimatedHours: 2 }
            ],
            tags: ['capstone', 'planning'],
            difficulty: 'beginner'
          },
          {
            id: 'task-6-4-2',
            title: 'Build data pipeline and baseline model',
            description: 'Create the initial data pipeline and train a baseline model.',
            estimatedMinutes: 240,
            resources: [
              { title: 'Cookiecutter Data Science', type: 'repo', url: 'https://cookiecutter-data-science.drivendata.org', free: true, estimatedHours: 2 }
            ],
            tags: ['capstone', 'pipeline'],
            difficulty: 'advanced'
          },
          {
            id: 'task-6-4-3',
            title: 'Iterate: improve, evaluate, document',
            description: 'Iterate on your model, evaluate performance, and document results.',
            estimatedMinutes: 240,
            resources: [],
            tags: ['capstone', 'iteration'],
            difficulty: 'advanced'
          },
          {
            id: 'task-6-4-4',
            title: 'Write a technical blog post about your project',
            description: 'Document your project in a technical blog post.',
            estimatedMinutes: 120,
            resources: [
              { title: 'Towards Data Science', type: 'blog', url: 'https://towardsdatascience.com', free: true, estimatedHours: 1 },
              { title: 'Hashnode', type: 'blog', url: 'https://hashnode.com', free: true, estimatedHours: 1 }
            ],
            tags: ['capstone', 'blog'],
            difficulty: 'intermediate'
          },
          {
            id: 'task-6-4-5',
            title: 'Push to GitHub with full README',
            description: 'Create a well-documented GitHub repository for your project.',
            estimatedMinutes: 60,
            resources: [
              { title: 'Awesome README', type: 'repo', url: 'https://github.com/academic/awesome-readme', free: true, estimatedHours: 1 }
            ],
            tags: ['capstone', 'github'],
            difficulty: 'beginner'
          }
        ]
      }
    ],
    capstoneProject: 'Complete a full-stack ML project with documentation and deployment'
  }
];
