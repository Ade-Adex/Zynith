// /app/data/index.ts

import { Course, NavLink, StatItem } from '@/app/types'

export const NAV_LINKS: NavLink[] = [
  { label: 'Courses', href: '#courses' },
  { label: 'Certification', href: '#certification' },
  { label: 'Pricing', href: '#pricing' },
]

export const STATS: StatItem[] = [
  { label: 'Active Learners', val: '50K+' },
  { label: 'Course Rating', val: '4.9/5' },
  { label: 'Industry Mentors', val: '120+' },
  { label: 'Global Reach', val: '24/7' },
]

export const COURSES: Course[] = [
  {
    id: 1,
    title: 'Rust for Systems Programming',
    type: 'Premium',
    tag: 'Trending',
    price: '129',
    instructor: 'Janus Thorne',
    tutorDetails: {
      name: 'Janus Thorne',
      bio: 'Ex-Kernel Engineer with 12+ years of low-level systems programming architecture experience.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
      expertise: ['Rust', 'C++', 'Linux Kernel', 'WebAssembly Frameworks'],
    },
    rating: 4.9,
    students: 920,
    duration: '15h',
    level: 'Expert',
    color: 'from-orange-600 to-red-600',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800',
    previewVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
    forumId: 'forum-rust-systems',
    chatId: 'chat-rust-systems',
    features: ['Borrow Checker Mastery', 'Low-level Optimization', 'Zero-cost Abstractions'],
    testimonies: [
      {
        id: 't1-1',
        studentName: 'Alex K.',
        rating: 5,
        reviewText: 'The memory safety module saved me weeks of tracking deep allocation pointer leaks in production.',
      }
    ],
    modules: [
      {
        id: 'r1-m1',
        title: 'Memory Safety & Ownership',
        description: 'Deep dive into standard compilation phases, stack vs heap allocations, and reference constraints.',
        lessonsCount: 2,
        lessons: [
          {
            id: 'r1-m1-l1',
            title: 'The Stack and the Heap',
            duration: '12m',
            contentType: 'hybrid',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            markdownBody: '### Memory Segments\nIn systems languages, knowing where data resides dictates execution speeds.',
            isFreePreview: true,
            isDownloadable: true,
            downloadUrl: 'https://example.com/downloads/rust-m1-l1.mp4',
            summary: 'Understand memory layouts before handling ownership rules.',
            quiz: {
              id: 'q-r1-m1-l1',
              title: 'Stack vs Heap Quick Check',
              passingScore: 100,
              questions: [
                {
                  id: 'r1-l1-q1',
                  question: 'Where do fixed-size variables reside at runtime execution?',
                  options: ['The Stack', 'The Heap', 'Content Addressing Registries'],
                  correctAnswer: 'The Stack',
                  explanation: 'Fixed size values are pushed onto the stack at compile time.'
                }
              ]
            }
          },
          {
            id: 'r1-m1-l2',
            title: 'The Three Rules of Ownership',
            duration: '18m',
            contentType: 'text',
            markdownBody: '### The Core Rules\n1. Each value in Rust has an owner.\n2. There can only be one owner at a time.',
            isFreePreview: false,
            isDownloadable: false,
            summary: 'The foundations of compilation without garbage collection.',
            quiz: {
              id: 'q-r1-m1-l2',
              title: 'Ownership Axioms',
              passingScore: 100,
              questions: [
                {
                  id: 'r1-l2-q1',
                  question: 'How many owners can a unique raw resource value point to concurrently?',
                  options: ['Exactly One', 'Up to Three', 'Unlimited'],
                  correctAnswer: 'Exactly One',
                  explanation: 'To prevent data races, Rust enforces exactly one owner for any given memory resource.'
                }
              ]
            }
          }
        ],
        quiz: {
          id: 'q-mod-r1-m1',
          title: 'Ownership Mechanics Module Assessment',
          passingScore: 80,
          questions: [
            {
              id: 'r1-m1-mq1',
              question: 'Which syntax explicitly prevents a move out of a struct value field?',
              options: ['ref keyword', 'Box::new()', 'std::mem::drop()'],
              correctAnswer: 'ref keyword',
              explanation: 'The ref keyword borrows a reference to a field rather than moving the value out.'
            }
          ]
        },
        assignment: {
          id: 'assign-r1-m1',
          title: 'Custom Safe Singly-Linked List',
          problemStatement: 'Implement a memory-safe stack that passes cargo check without any runtime reference leaks.',
          submissionTemplateUrl: 'https://github.com/example/rust-linked-list-template',
          peerReviewsRequired: 3,
          minPeerScoreToPass: 80
        }
      }
    ]
  },
  {
    id: 2,
    title: 'Next.js 15 Enterprise Masterclass',
    type: 'Premium',
    tag: 'Bestseller',
    price: '99',
    instructor: 'Zynith Team',
    tutorDetails: {
      name: 'Zynith Dev Group',
      bio: 'Core Platform Engineering outfit specializing in enterprise web optimization scale architectures.',
      avatar: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=400',
      expertise: ['Next.js', 'React Server Components', 'Edge Caching Systems'],
    },
    rating: 5.0,
    students: 3000,
    duration: '10h',
    level: 'Advanced',
    color: 'from-slate-900 to-slate-700',
    image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=800',
    previewVideo: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    forumId: 'forum-next-masterclass',
    chatId: 'chat-next-masterclass',
    features: ['App Router Architecture', 'Server Actions', 'Edge Runtime Pipelines'],
    testimonies: [
      {
        id: 't2-1',
        studentName: 'Sarah M.',
        rating: 5,
        reviewText: 'Explaining partial hydration streams step-by-step made everything click instantly.',
      }
    ],
    modules: [
      {
        id: 'n2-m1',
        title: 'React Server Components Optimization',
        description: 'Architecting isolated asynchronous execution streams at the server network barrier.',
        lessonsCount: 1,
        lessons: [
          {
            id: 'n2-m1-l1',
            title: 'Streaming & Suspense Foundations',
            duration: '22m',
            contentType: 'video',
            videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            isFreePreview: true,
            isDownloadable: true,
            downloadUrl: 'https://example.com/downloads/next-n1-l1.mp4',
            summary: 'Breaking down sequential blocking UI layouts.',
            quiz: {
              id: 'q-n2-m1-l1',
              title: 'Suspense Assertions',
              passingScore: 100,
              questions: [
                {
                  id: 'n2-l1-q1',
                  question: 'What boundary component isolates slower dynamic asynchronous data fetches?',
                  options: ['<Suspense />', '<ErrorBoundary />', '<CacheGate />'],
                  correctAnswer: '<Suspense />',
                  explanation: 'Suspense boundaries allow parts of the UI to show fallbacks while dynamic data resolves.'
                }
              ]
            }
          }
        ],
        quiz: {
          id: 'q-mod-n2-m1',
          title: 'RSC Composition Knowledge Gate',
          passingScore: 100,
          questions: [
            {
              id: 'n2-m1-mq1',
              question: 'Can Server Components consume Context Providers directly?',
              options: ['Yes, universally', 'No, context requires client runtime environments'],
              correctAnswer: 'No, context requires client runtime environments',
              explanation: 'React Context relies on hook updates which are not available during server-side renders.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 3,
    title: 'Advanced TypeScript & Type-Level Magic',
    type: 'Premium',
    tag: 'New',
    price: '79',
    instructor: 'Lucas Vance',
    tutorDetails: {
      name: 'Lucas Vance',
      bio: 'Compiler engineer specializing in static type verification libraries.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
      expertise: ['TypeScript Core', 'AST Parsers', 'Type System Design'],
    },
    rating: 4.8,
    students: 1400,
    duration: '8h',
    level: 'Advanced',
    color: 'from-blue-600 to-indigo-800',
    image: 'https://images.unsplash.com/photo-1516116211223-5c359a36298a?q=80&w=800',
    forumId: 'forum-ts-magic',
    chatId: 'chat-ts-magic',
    features: ['Conditional Type Engines', 'Template Literal Types', 'Recursive Mappings'],
    testimonies: [
      {
        id: 't3-1',
        studentName: 'Daniel O.',
        rating: 5,
        reviewText: 'Writing production string template type schemas became second nature after Module 1.',
      }
    ],
    modules: [
      {
        id: 'ts-m1',
        title: 'Conditional Types & Distributivity',
        description: 'Harnessing structural ternary maps over naked parameters.',
        lessonsCount: 1,
        lessons: [
          {
            id: 'ts-m1-l1',
            title: 'Naked Type Parameter Distribution',
            duration: '25m',
            contentType: 'text',
            markdownBody: '### Distributive Mechanics\nWhen generic parameters receive union sets, conditional checks evaluate systematically.',
            isFreePreview: false,
            isDownloadable: true,
            downloadUrl: 'https://example.com/downloads/ts-distributive.txt',
            summary: 'Deep dive into union evaluation matrices.',
            quiz: {
              id: 'q-ts-m1-l1',
              title: 'Distribution Isolation Checks',
              passingScore: 100,
              questions: [
                {
                  id: 'ts-l1-q1',
                  question: 'How do you prevent a generic parameter from distribution behavior?',
                  options: ['Wrap in square brackets [T]', 'Pass through partial attributes', 'Cast as unknown'],
                  correctAnswer: 'Wrap in square brackets [T]',
                  explanation: 'Wrapping the conditional comparison targets inside arrays tells TS to treat the union as one bundle.'
                }
              ]
            }
          }
        ],
        quiz: {
          id: 'q-mod-ts-m1',
          title: 'Conditional Type Gates',
          passingScore: 80,
          questions: [
            {
              id: 'ts-m1-mq1',
              question: 'What keyword reveals hidden evaluation variables inside conditional clauses?',
              options: ['infer', 'extends', 'keyof'],
              correctAnswer: 'infer',
              explanation: 'The infer operator lets you dynamically extract and bind types within conditional expressions.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 4,
    title: 'BNB Chain Web3 Trading Terminal Architecture',
    type: 'Premium',
    tag: 'Trending',
    price: '199',
    instructor: 'Solomon Oluwatosin',
    tutorDetails: {
      name: 'Solomon Oluwatosin',
      bio: 'Full-stack Web3 architect and automated decentralized high-frequency tooling developer.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Solomon',
      expertise: ['Solidity', 'Ethers.js', 'BNB Chain Architecture', 'DeFi Liquidity Pools'],
    },
    rating: 4.95,
    students: 2100,
    duration: '18h',
    level: 'Expert',
    color: 'from-yellow-500 to-amber-600',
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800',
    forumId: 'forum-bnb-terminal',
    chatId: 'chat-bnb-terminal',
    features: ['High-speed Swap Integration', 'Mempool Monitoring Engines', 'Real-time Canvas Charts'],
    testimonies: [
      {
        id: 't4-1',
        studentName: 'Emeka N.',
        rating: 5,
        reviewText: 'Building the pancake swap sniper router inside Module 2 was worth every single Naira.',
      }
    ],
    modules: [
      {
        id: 'bnb-m1',
        title: 'Mempool Extraction & RPC Optimization',
        description: 'Setting up high-speed persistent event listeners on BSC JSON-RPC nodes.',
        lessonsCount: 1,
        lessons: [
          {
            id: 'bnb-m1-l1',
            title: 'WebSocket Event Streams vs HTTP Polling',
            duration: '35m',
            contentType: 'hybrid',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            markdownBody: '### Stream Mechanics\nReal-time tools must listen to logs using strict event subscriptions to outrun execution lags.',
            isFreePreview: true,
            isDownloadable: false,
            summary: 'Benchmark block processing latency differences.',
            quiz: {
              id: 'q-bnb-m1-l1',
              title: 'Stream Mechanics Verification',
              passingScore: 100,
              questions: [
                {
                  id: 'bnb-l1-q1',
                  question: 'Which method reduces block parsing confirmation overhead?',
                  options: ['Persistent WebSockets subscriptions', 'Debounced REST queries', 'Iterative setTimeouts'],
                  correctAnswer: 'Persistent WebSockets subscriptions',
                  explanation: 'WebSockets push new block information down the socket pipeline immediately without poll overhead.'
                }
              ]
            }
          }
        ],
        quiz: {
          id: 'q-mod-bnb-m1',
          title: 'Node Plumbing Infrastructure Review',
          passingScore: 100,
          questions: [
            {
              id: 'bnb-m1-mq1',
              question: 'What is the default block target spacing execution window on BNB Chain?',
              options: ['3 seconds', '12 seconds', '100 milliseconds'],
              correctAnswer: '3 seconds',
              explanation: 'BNB Chain produces blocks consistently in roughly 3-second operational increments.'
            }
          ]
        },
        assignment: {
          id: 'assign-bnb-m1',
          title: 'Build a Live Transaction Monitor',
          problemStatement: 'Write a small optimized Node cluster script that catches specific addresses within 1 block execution frame.',
          peerReviewsRequired: 2,
          minPeerScoreToPass: 90
        }
      }
    ]
  },
  {
    id: 5,
    title: 'High-Performance Go Microservices',
    type: 'Premium',
    price: '119',
    instructor: 'Elena Rostova',
    tutorDetails: {
      name: 'Elena Rostova',
      bio: 'Distributed systems architect specialized in asynchronous concurrency networking protocols.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400',
      expertise: ['Go Runtime', 'gRPC Profiles', 'Protocol Buffers', 'Redis Clusters'],
    },
    rating: 4.7,
    students: 1850,
    duration: '14h',
    level: 'Intermediate',
    color: 'from-cyan-500 to-blue-700',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800',
    forumId: 'forum-go-micro',
    chatId: 'chat-go-micro',
    features: ['Goroutine Leak Avoidance', 'Zero-allocation Encoding APIs', 'Context Cancellation Trees'],
    testimonies: [
      {
        id: 't5-1',
        studentName: 'Marcus V.',
        rating: 4,
        reviewText: 'The profiling breakdowns with pprof pinpointed structural memory traps in our stack instantly.',
      }
    ],
    modules: [
      {
        id: 'go-m1',
        title: 'Goroutine Lifecycles & Channels',
        description: 'Managing dynamic concurrency channels safely without causing deadlock blocking allocations.',
        lessonsCount: 1,
        lessons: [
          {
            id: 'go-m1-l1',
            title: 'Preventing Channel Resource Seepage',
            duration: '20m',
            contentType: 'video',
            videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            isFreePreview: false,
            isDownloadable: true,
            downloadUrl: 'https://example.com/downloads/go-leak.mp4',
            summary: 'Isolating context closures within parallel loops.',
            quiz: {
              id: 'q-go-m1-l1',
              title: 'Channel Blocking Realities',
              passingScore: 100,
              questions: [
                {
                  id: 'go-l1-q1',
                  question: 'What occurs when sending down an unbuffered channel with no concurrent active listeners?',
                  options: ['The goroutine blocks permanently', 'Panic exception error', 'Data drops implicitly'],
                  correctAnswer: 'The goroutine blocks permanently',
                  explanation: 'Unbuffered channels require a paired sender and receiver ready at the exact same moment.'
                }
              ]
            }
          }
        ],
        quiz: {
          id: 'q-mod-go-m1',
          title: 'Concurrency Synchronization Assessment',
          passingScore: 80,
          questions: [
            {
              id: 'go-m1-mq1',
              question: 'Which construct handles multiple non-blocking async channel read operations?',
              options: ['select blocks', 'switch structures', 'sync.Map instances'],
              correctAnswer: 'select blocks',
              explanation: 'A select statement lets a goroutine wait on multiple communication pathways simultaneously.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 6,
    title: 'Docker & Kubernetes Production Blueprints',
    type: 'Premium',
    tag: 'Bestseller',
    price: '149',
    instructor: 'DevOps Alliance',
    tutorDetails: {
      name: 'DevOps Alliance Group',
      bio: 'Cloud Infrastructure guild designing redundant orchestration nodes for banking APIs.',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400',
      expertise: ['Kubernetes Orchestration', 'Cilium Networking', 'Service Mesh Topologies'],
    },
    rating: 4.92,
    students: 4200,
    duration: '22h',
    level: 'Advanced',
    color: 'from-blue-700 to-cyan-900',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=800',
    forumId: 'forum-k8s-blueprints',
    chatId: 'chat-k8s-blueprints',
    features: ['Multi-stage Container Shrinking', 'Ingress Controller Tuning', 'GitOps Deployment Pipelines'],
    testimonies: [
      {
        id: 't6-1',
        studentName: 'Julian F.',
        rating: 5,
        reviewText: 'The multi-stage dockerfile configurations shaved off 600MB from our core microservice image.',
      }
    ],
    modules: [
      {
        id: 'k8s-m1',
        title: 'Advanced Ingress Routing & TLS',
        description: 'Provisioning stable high-throughput entry networks inside decoupled cluster boundaries.',
        lessonsCount: 1,
        lessons: [
          {
            id: 'k8s-m1-l1',
            title: 'Configuring NGINX Proxy Headers',
            duration: '18m',
            contentType: 'text',
            markdownBody: '### Ingress Annotations\nManaging upstream buffer sizes via yaml settings stops 502 error cascades during request spikes.',
            isFreePreview: false,
            isDownloadable: false,
            summary: 'Tuning configuration files for production load limits.',
            quiz: {
              id: 'q-k8s-m1-l1',
              title: 'Ingress Configuration Check',
              passingScore: 100,
              questions: [
                {
                  id: 'k8s-l1-q1',
                  question: 'Which mechanism maps external static domains to cluster-local service handles?',
                  options: ['Ingress Resources', 'ConfigMaps', 'NodePort Allocation'],
                  correctAnswer: 'Ingress Resources',
                  explanation: 'Ingress routing resources manage application endpoint paths mapping external URLs to specific cluster services.'
                }
              ]
            }
          }
        ],
        quiz: {
          id: 'q-mod-k8s-m1',
          title: 'Cluster Communication Validation',
          passingScore: 80,
          questions: [
            {
              id: 'k8s-m1-mq1',
              question: 'Which component distributes networking tracking values between physical nodes?',
              options: ['kube-proxy', 'kube-scheduler', 'etcd storage'],
              correctAnswer: 'kube-proxy',
              explanation: 'Kube-proxy maintains physical environment host network constraints and executes request forwarding rules.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 7,
    title: 'Foundations of UI Design System Architecture',
    type: 'Free',
    tag: 'New',
    instructor: 'Clara Sterling',
    tutorDetails: {
      name: 'Clara Sterling',
      bio: 'Lead Design Advocate crafting modular token configurations for global fintech groups.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400',
      expertise: ['Figma API Token Syncs', 'Design Semantics', 'Component Componentization'],
    },
    rating: 4.6,
    students: 5100,
    duration: '4h',
    level: 'Beginner',
    color: 'from-pink-500 to-purple-600',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=800',
    forumId: 'forum-design-tokens',
    chatId: 'chat-design-tokens',
    features: ['Design Token Pipelines', 'Accessibility Color Matrixing', 'Figma Variant Engines'],
    testimonies: [
      {
        id: 't7-1',
        studentName: 'Tariq A.',
        rating: 5,
        reviewText: 'Even as a pure frontend developer, the atomic setup instructions helped me clean up global variables.',
      }
    ],
    modules: [
      {
        id: 'ds-m1',
        title: 'Semantic Naming Schemes & Tokens',
        description: 'Constructing robust token variations that abstract direct color hex values safely.',
        lessonsCount: 1,
        lessons: [
          {
            id: 'ds-m1-l1',
            title: 'Global vs Contextual Aliases',
            duration: '15m',
            contentType: 'video',
            videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            isFreePreview: true,
            isDownloadable: false,
            summary: 'Structuring scalable naming hierarchies for variable design files.',
            quiz: {
              id: 'q-ds-m1-l1',
              title: 'Token Structure Assertions',
              passingScore: 100,
              questions: [
                {
                  id: 'ds-l1-q1',
                  question: 'What tier of token directly holds primitive hexadecimal string values?',
                  options: ['Global/Global Tokens', 'Semantic Aliases', 'Component Overrides'],
                  correctAnswer: 'Global/Global Tokens',
                  explanation: 'Global values act as raw primitive variables containing absolute parameters (e.g., #FF0000).'
                }
              ]
            }
          }
        ],
        quiz: {
          id: 'q-mod-ds-m1',
          title: 'Design-to-Code Gate',
          passingScore: 80,
          questions: [
            {
              id: 'ds-m1-mq1',
              question: 'Why avoid assigning global color values directly to components?',
              options: ['Breaks automated dark mode switches', 'Increases bundle memory weight', 'Prevents compilation runs'],
              correctAnswer: 'Breaks automated dark mode switches',
              explanation: 'Without a semantic bridge token layer, changing application themes requires updating individual layout assignments.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 8,
    title: 'MongoDB Query Tuning & Scaling Plans',
    type: 'Premium',
    price: '89',
    instructor: 'Zynith Backend Team',
    tutorDetails: {
      name: 'Zynith Systems Team',
      bio: 'Core database operations outfit overseeing high-throughput clusters.',
      avatar: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=400',
      expertise: ['Index Optimization', 'Aggregation Pipeline Tuning', 'Sharding Clusters'],
    },
    rating: 4.75,
    students: 840,
    duration: '9h',
    level: 'Advanced',
    color: 'from-emerald-600 to-teal-800',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800',
    forumId: 'forum-mongo-scaling',
    chatId: 'chat-mongo-scaling',
    features: ['Compound Index Optimization', 'Covered Query Pipelines', 'Sharding Mechanics'],
    testimonies: [
      {
        id: 't8-1',
        studentName: 'Rohan G.',
        rating: 5,
        reviewText: 'Rewriting our matching engine using covered index fields dropped disk seek times to zero.',
      }
    ],
    modules: [
      {
        id: 'mg-m1',
        title: 'Explaining Execution Metrics',
        description: 'Interpreting winning query paths to prevent dangerous physical database collection sweeps.',
        lessonsCount: 1,
        lessons: [
          {
            id: 'mg-m1-l1',
            title: 'Reading .explain() Stat Blocks',
            duration: '24m',
            contentType: 'text',
            markdownBody: '### Execution Mechanics\nLook for COLLSCAN vs IXSCAN stages. COLLSCAN implies the machine evaluated every single document.',
            isFreePreview: false,
            isDownloadable: true,
            downloadUrl: 'https://example.com/downloads/mongo-explain.txt',
            summary: 'Isolating slow database queries quickly.',
            quiz: {
              id: 'q-mg-m1-l1',
              title: 'Explain Stage Verification',
              passingScore: 100,
              questions: [
                {
                  id: 'mg-l1-q1',
                  question: 'Which stage state confirms an index resource was successfully utilized?',
                  options: ['IXSCAN', 'COLLSCAN', 'FETCH_SWEEP'],
                  correctAnswer: 'IXSCAN',
                  explanation: 'IXSCAN indicates the query engine checked the index structure without running a full collection scan.'
                }
              ]
            }
          }
        ],
        quiz: {
          id: 'q-mod-mg-m1',
          title: 'Query Plan Verification Gate',
          passingScore: 100,
          questions: [
            {
              id: 'mg-m1-mq1',
              question: 'Does the order of defined keys inside compound indexes affect filter matches?',
              options: ['Yes, order dictates match performance', 'No, processing handles indexing transparently'],
              correctAnswer: 'Yes, order dictates match performance',
              explanation: 'Compound indexes match from left to right; your query filters must align with that indexing order.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 9,
    title: 'Enterprise Web Security & OAuth Mastery',
    type: 'Premium',
    tag: 'Trending',
    price: '159',
    instructor: 'Janus Thorne',
    tutorDetails: {
      name: 'Janus Thorne',
      bio: 'Ex-Kernel Engineer with 12+ years of low-level systems programming architecture experience.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
      expertise: ['OAuth Core Specification', 'JWT Cryptography', 'CORS Mechanics'],
    },
    rating: 4.88,
    students: 1100,
    duration: '11h',
    level: 'Expert',
    color: 'from-purple-800 to-indigo-950',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800',
    forumId: 'forum-oauth-mastery',
    chatId: 'chat-oauth-mastery',
    features: ['Silent Token Refresh Flows', 'PKCE Extension Architecture', 'HttpOnly Cookie Storage'],
    testimonies: [
      {
        id: 't9-1',
        studentName: 'Chinedu U.',
        rating: 5,
        reviewText: 'The silent refresh workflow fixed our persistent logging issues across distributed subdomains.',
      }
    ],
    modules: [
      {
        id: 'sec-m1',
        title: 'OAuth Authorization Code Grant with PKCE',
        description: 'Securing public clients from token interception vulnerabilities on native and SPA channels.',
        lessonsCount: 1,
        lessons: [
          {
            id: 'sec-m1-l1',
            title: 'Verifiers and Code Challenges',
            duration: '30m',
            contentType: 'hybrid',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            markdownBody: '### PKCE Mechanics\nGenerating unguessable local high-entropy hashes protects intercept gateways during routing redirection legs.',
            isFreePreview: false,
            isDownloadable: true,
            downloadUrl: 'https://example.com/downloads/pkce-flow.mp4',
            summary: 'Stopping interception routines without using client secrets.',
            quiz: {
              id: 'q-sec-m1-l1',
              title: 'PKCE Mathematics Verification',
              passingScore: 100,
              questions: [
                {
                  id: 'sec-l1-q1',
                  question: 'What asset does a client application submit during the final token swap exchange step?',
                  options: ['The raw Code Verifier string', 'The original Code Challenge hash', 'The global client secret'],
                  correctAnswer: 'The raw Code Verifier string',
                  explanation: 'The application presents the raw verifier string so the authorization server can hash it and confirm it matches the challenge.'
                }
              ]
            }
          }
        ],
        quiz: {
          id: 'q-mod-sec-m1',
          title: 'Identity Provider Gatekeeper Verification',
          passingScore: 100,
          questions: [
            {
              id: 'sec-m1-mq1',
              question: 'Where should access tokens be stored to protect them from cross-site scripting (XSS) attacks?',
              options: ['In-memory variables or encrypted HttpOnly cookies', 'LocalStorage keys', 'SessionStorage properties'],
              correctAnswer: 'In-memory variables or encrypted HttpOnly cookies',
              explanation: 'HttpOnly cookies block browser scripts from reading the token payload directly, shielding it from XSS.'
            }
          ]
        },
        assignment: {
          id: 'assign-sec-m1',
          title: 'Construct a Custom Silent Refresh Endpoint',
          problemStatement: 'Write an API point routing secure rotated tokens without triggering standard login modals.',
          peerReviewsRequired: 3,
          minPeerScoreToPass: 85
        }
      }
    ]
  },
  {
    id: 10,
    title: 'Asynchronous Event-Driven Architectures',
    type: 'Premium',
    price: '179',
    instructor: 'Lucas Vance',
    tutorDetails: {
      name: 'Lucas Vance',
      bio: 'Compiler engineer specializing in static type verification libraries.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
      expertise: ['Kafka Brokers', 'RabbitMQ Messaging Topologies', 'Eventual Consistency'],
    },
    rating: 4.91,
    students: 980,
    duration: '16h',
    level: 'Expert',
    color: 'from-violet-700 to-fuchsia-900',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800',
    forumId: 'forum-event-architecture',
    chatId: 'chat-event-architecture',
    features: ['Idempotency Design Keys', 'Dead Letter Queue Routing', 'Consumer Group Rebalancing'],
    testimonies: [
      {
        id: 't10-1',
        studentName: 'Liam W.',
        rating: 5,
        reviewText: 'The outbox structural design layout saved our ordering stack from catastrophic multi-write split failures.',
      }
    ],
    modules: [
      {
        id: 'evt-m1',
        title: 'Partitioning & Consumer Groups',
        description: 'Distributing concurrent streams across horizontally grouped system message processors.',
        lessonsCount: 1,
        lessons: [
          {
            id: 'evt-m1-l1',
            title: 'Message Ordering Guarantees',
            duration: '28m',
            contentType: 'video',
            videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            isFreePreview: false,
            isDownloadable: false,
            summary: 'Forcing strict processing sequences inside distributed streaming logs.',
            quiz: {
              id: 'q-evt-m1-l1',
              title: 'Partitioning Verification Checks',
              passingScore: 100,
              questions: [
                {
                  id: 'evt-l1-q1',
                  question: 'How does Kafka guarantee message order within a distributed cluster setup?',
                  options: ['Order is guaranteed strictly within a single partition', 'Globally across all topics', 'Using timestamp sorting buffers'],
                  correctAnswer: 'Order is guaranteed strictly within a single partition',
                  explanation: 'Kafka guarantees sequential processing order within a specific partition, not across multiple partitions.'
                }
              ]
            }
          }
        ],
        quiz: {
          id: 'q-mod-evt-m1',
          title: 'Broker Protocol Knowledge Gate',
          passingScore: 80,
          questions: [
            {
              id: 'evt-m1-mq1',
              question: 'What structural configuration avoids data loss when microservice updates crash mid-execution?',
              options: ['Disabling automated offset auto-commits', 'Increasing replica limits', 'Purging queue entries'],
              correctAnswer: 'Disabling automated offset auto-commits',
              explanation: 'Manually acknowledging offsets ensures messages are only marked processed after your database writes succeed.'
            }
          ]
        }
      }
    ]
  }
]