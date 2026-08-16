const formulas = [
  {
    "id": 1,
    "title": "Quadratic Formula",
    "subject": "Mathematics",
    "category": "Algebra",
    "level": "Foundational",

    "formula":
      "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",

    "explanation":
      "Used to solve quadratic equations of the form ax² + bx + c = 0.",

    "variables": [
      { "symbol": "a", "meaning": "coefficient of x²" },
      { "symbol": "b", "meaning": "coefficient of x" },
      { "symbol": "c", "meaning": "constant term" },
    ],

    "example": "Solve x² + 5x + 6 = 0",
  },

  {
    "id": 2,
    "title": "Pythagoras Theorem",
    "subject": "Mathematics",
    "category": "Geometry",
    "level": "Foundational",

    "formula": "a^2 + b^2 = c^2",

    "explanation":
      "Relates the sides of a right-angled triangle.",

    "variables": [
      { "symbol": "a", "meaning": "opposite side" },
      { "symbol": "b", "meaning": "adjacent side" },
      { "symbol": "c", "meaning": "hypotenuse" },
    ],

    "example": "Find hypotenuse when a=3, b=4",
  },

  {
    "id": 3,
    "title": "Area of a Circle",
    "subject": "Mathematics",
    "category": "Geometry",
    "level": "Foundational",

    "formula": "A = \\pi r^2",

    "explanation":
      "Used to calculate the area of a circle.",

    "variables": [
      { "symbol": "A", "meaning": "area" },
      { "symbol": "r", "meaning": "radius" },
      { "symbol": "\\pi", "meaning": "3.142 or 22/7" },
    ],

    "example": "Find area when r = 7cm",
  },

  {
    id: 4,
    title: "Simple Interest",
    subject: "Mathematics",
    category: "Commercial Math",
    level: "Foundational",

    formula: "SI = \\frac{PRT}{100}",

    explanation:
      "Calculates simple interest on a principal amount.",

    variables: [
      { symbol: "P", meaning: "principal" },
      { symbol: "R", meaning: "rate" },
      { symbol: "T", meaning: "time" },
    ],

    example: "Find SI when P=5000, R=10%, T=2yrs",
  },

  {
    id: 5,
    title: "Compound Interest",
    subject: "Mathematics",
    category: "Commercial Math",
    level: "University",

    formula:
      "A = P\\left(1 + \\frac{r}{n}\\right)^{nt}",

    explanation:
      "Used to calculate compound interest.",

    variables: [
      { symbol: "A", meaning: "final amount" },
      { symbol: "P", meaning: "principal" },
      { symbol: "r", meaning: "interest rate" },
      { symbol: "n", meaning: "number of times compounded" },
      { symbol: "t", meaning: "time" },
    ],

    example: "Find amount after 2 years",
  },

  {
    id: 6,
    title: "Slope Formula",
    subject: "Mathematics",
    category: "Coordinate Geometry",
    level: "Foundational",

    formula:
      "m = \\frac{y_2 - y_1}{x_2 - x_1}",

    explanation:
      "Calculates the slope of a straight line.",

    variables: [
      { symbol: "m", meaning: "slope" },
      { symbol: "x_1", meaning: "first x-coordinate" },
      { symbol: "x_2", meaning: "second x-coordinate" },
      { symbol: "y_1", meaning: "first y-coordinate" },
      { symbol: "y_2", meaning: "second y-coordinate" },
    ],

    example: "Find slope between (2,3) and (4,7)",
  },

  {
    id: 7,
    title: "Distance Formula",
    subject: "Mathematics",
    category: "Coordinate Geometry",
    level: "Foundational",

    formula:
      "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}",

    explanation:
      "Calculates distance between two points.",

    variables: [
      { symbol: "d", meaning: "distance" },
      { symbol: "x_1", meaning: "first x-coordinate" },
      { symbol: "x_2", meaning: "second x-coordinate" },
      { symbol: "y_1", meaning: "first y-coordinate" },
      { symbol: "y_2", meaning: "second y-coordinate" },
    ],

    example: "Find distance between (1,2) and (4,6)",
  },

  {
    id: 8,
    title: "Volume of Cylinder",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",

    formula: "V = \\pi r^2 h",

    explanation:
      "Used to calculate the volume of a cylinder.",

    variables: [
      { symbol: "V", meaning: "volume" },
      { symbol: "r", meaning: "radius" },
      { symbol: "h", meaning: "height" },
    ],

    example: "Find volume when r=7cm and h=10cm",
  },

  {
    id: 9,
    title: "Area of Triangle",
    subject: "Mathematics",
    category: "Geometry",
    level: "Foundational",

    formula: "A = \\frac{1}{2}bh",

    explanation:
      "Calculates the area of a triangle.",

    variables: [
      { symbol: "b", meaning: "base" },
      { symbol: "h", meaning: "height" },
    ],

    example: "Find area when b=10cm and h=8cm",
  },

  {
    id: 10,
    title: "Probability Formula",
    subject: "Mathematics",
    category: "Statistics",
    level: "Foundational",

    formula:
      "P(E) = \\frac{n(E)}{n(S)}",

    explanation:
      "Measures likelihood of an event occurring.",

    variables: [
      { symbol: "n(E)", meaning: "favorable outcomes" },
      { symbol: "n(S)", meaning: "sample space" },
    ],

    example: "Probability of getting 3 on a dice",
  },

  // =========================
  // PHYSICS
  // =========================

  {
    id: 11,
    title: "Ohm's Law",
    subject: "Physics",
    category: "Electricity",
    level: "Foundational",

    formula: "V = IR",

    explanation:
      "Relates voltage, current, and resistance in a circuit.",

    variables: [
      { symbol: "V", meaning: "Voltage (V)" },
      { symbol: "I", meaning: "Current (A)" },
      { symbol: "R", meaning: "Resistance (Ω)" },
    ],

    example: "If I = 2A and R = 5Ω, find V",
  },

  {
    id: 12,
    title: "Newton's Second Law",
    subject: "Physics",
    category: "Mechanics",
    level: "Foundational",

    formula: "F = ma",

    explanation:
      "Force acting on an object is equal to mass × acceleration.",

    variables: [
      { symbol: "F", meaning: "Force (N)" },
      { symbol: "m", meaning: "mass (kg)" },
      { symbol: "a", meaning: "acceleration (m/s²)" },
    ],

    example: "Find force when m=10kg, a=2m/s²",
  },

  {
    id: 13,
    title: "Kinetic Energy",
    subject: "Physics",
    category: "Energy",
    level: "University",

    formula:
      "KE = \\frac{1}{2}mv^2",

    explanation:
      "Energy possessed by a moving object.",

    variables: [
      { symbol: "m", meaning: "mass" },
      { symbol: "v", meaning: "velocity" },
    ],

    example: "Find KE of a 2kg object moving at 3m/s",
  },

  {
    id: 14,
    title: "Potential Energy",
    subject: "Physics",
    category: "Energy",
    level: "Foundational",

    formula: "PE = mgh",

    explanation:
      "Energy possessed due to position or height.",

    variables: [
      { symbol: "m", meaning: "mass" },
      { symbol: "g", meaning: "gravity" },
      { symbol: "h", meaning: "height" },
    ],

    example: "Find PE of a 5kg object at 10m",
  },

  {
    id: 15,
    title: "Speed Formula",
    subject: "Physics",
    category: "Motion",
    level: "Foundational",

    formula:
      "Speed = \\frac{Distance}{Time}",

    explanation:
      "Calculates how fast an object moves.",

    variables: [
      { symbol: "Distance", meaning: "distance traveled" },
      { symbol: "Time", meaning: "time taken" },
    ],

    example: "Find speed if 100m covered in 20s",
  },

  {
    id: 16,
    title: "Momentum",
    subject: "Physics",
    category: "Mechanics",
    level: "Foundational",

    formula: "p = mv",

    explanation:
      "Momentum is mass multiplied by velocity.",

    variables: [
      { symbol: "p", meaning: "momentum" },
      { symbol: "m", meaning: "mass" },
      { symbol: "v", meaning: "velocity" },
    ],

    example: "Find momentum of 4kg object at 5m/s",
  },

  {
    id: 17,
    title: "Pressure Formula",
    subject: "Physics",
    category: "Fluid Mechanics",
    level: "Foundational",

    formula:
      "P = \\frac{F}{A}",

    explanation:
      "Pressure is force per unit area.",

    variables: [
      { symbol: "P", meaning: "pressure" },
      { symbol: "F", meaning: "force" },
      { symbol: "A", meaning: "area" },
    ],

    example: "Find pressure when F=100N and A=5m²",
  },

  {
    id: 18,
    title: "Wave Equation",
    subject: "Physics",
    category: "Waves",
    level: "Foundational",

    formula: "v = f\\lambda",

    explanation:
      "Relates wave speed, frequency, and wavelength.",

    variables: [
      { symbol: "v", meaning: "wave speed" },
      { symbol: "f", meaning: "frequency" },
      { symbol: "\\lambda", meaning: "wavelength" },
    ],

    example: "Find wave speed when f=50Hz",
  },

  // =========================
  // CHEMISTRY
  // =========================

  {
    id: 19,
    title: "Mole Formula",
    subject: "Chemistry",
    category: "Stoichiometry",
    level: "Foundational",

    formula:
      "n = \\frac{m}{M}",

    explanation:
      "Relates mass, molar mass, and number of moles.",

    variables: [
      { symbol: "n", meaning: "number of moles" },
      { symbol: "m", meaning: "mass (g)" },
      { symbol: "M", meaning: "molar mass (g/mol)" },
    ],

    example: "Find moles of 10g of NaCl",
  },

  {
    id: 20,
    title: "pH Formula",
    subject: "Chemistry",
    category: "Acids & Bases",
    level: "University",

    formula:
      "pH = -\\log[H^+]",

    explanation:
      "Measures acidity or alkalinity of a solution.",

    variables: [
      {
        symbol: "[H^+]",
        meaning:
          "hydrogen ion concentration",
      },
    ],

    example:
      "Find pH if [H⁺] = 1×10⁻³",
  },

  {
    id: 21,
    title: "Density Formula",
    subject: "Chemistry",
    category: "Physical Chemistry",
    level: "Foundational",

    formula:
      "\\rho = \\frac{m}{V}",

    explanation:
      "Density is mass per unit volume.",

    variables: [
      { symbol: "\\rho", meaning: "density" },
      { symbol: "m", meaning: "mass" },
      { symbol: "V", meaning: "volume" },
    ],

    example: "Find density of 20g occupying 5cm³",
  },

  {
    id: 22,
    title: "Percentage Yield",
    subject: "Chemistry",
    category: "Stoichiometry",
    level: "University",

    formula:
      "\\%Yield = \\frac{Actual\\ Yield}{Theoretical\\ Yield} \\times 100",

    explanation:
      "Measures efficiency of a chemical reaction.",

    variables: [
      {
        symbol: "Actual Yield",
        meaning:
          "experimental yield",
      },
      {
        symbol: "Theoretical Yield",
        meaning:
          "expected yield",
      },
    ],

    example:
      "Find percentage yield if actual=8g and theoretical=10g",
  },

  {
    id: 23,
    title: "Avogadro's Law",
    subject: "Chemistry",
    category: "Gas Laws",
    level: "Foundational",

    formula:
      "\\frac{V_1}{n_1} = \\frac{V_2}{n_2}",

    explanation:
      "Equal volumes of gases contain equal number of molecules.",

    variables: [
      { symbol: "V", meaning: "volume" },
      { symbol: "n", meaning: "number of moles" },
    ],

    example: "Find final volume of gas",
  },

  {
    id: 24,
    title: "Ideal Gas Equation",
    subject: "Chemistry",
    category: "Gas Laws",
    level: "University",

    formula:
      "PV = nRT",

    explanation:
      "Relates pressure, volume, temperature, and moles.",

    variables: [
      { symbol: "P", meaning: "pressure" },
      { symbol: "V", meaning: "volume" },
      { symbol: "n", meaning: "moles" },
      { symbol: "R", meaning: "gas constant" },
      { symbol: "T", meaning: "temperature" },
    ],

    example: "Find pressure of gas",
  },

  // =========================
  // BIOLOGY
  // =========================

  {
    id: 25,
    title: "Magnification Formula",
    subject: "Biology",
    category: "Microscopy",
    level: "Foundational",

    formula:
      "Magnification = \\frac{Image\\ Size}{Actual\\ Size}",

    explanation:
      "Used to calculate magnification in microscopy.",

    variables: [
      { symbol: "Image Size", meaning: "measured image size" },
      { symbol: "Actual Size", meaning: "real size" },
    ],

    example: "Find magnification of specimen",
  },

  {
    id: 26,
    title: "Population Growth Rate",
    subject: "Biology",
    category: "Ecology",
    level: "University",

    formula:
      "Growth\\ Rate = Birth\\ Rate - Death\\ Rate",

    explanation:
      "Calculates increase or decrease in population.",

    variables: [
      { symbol: "Birth Rate", meaning: "births in population" },
      { symbol: "Death Rate", meaning: "deaths in population" },
    ],

    example: "Find population growth rate",
  },

  // =========================
  // ECONOMICS
  // =========================

  {
    id: 27,
    title: "Profit Formula",
    subject: "Economics",
    category: "Business",
    level: "Foundational",

    formula:
      "Profit = Selling\\ Price - Cost\\ Price",

    explanation:
      "Calculates profit from a transaction.",

    variables: [
      { symbol: "Selling Price", meaning: "amount sold" },
      { symbol: "Cost Price", meaning: "amount bought" },
    ],

    example: "Find profit if SP=5000 and CP=3500",
  },

  {
    id: 28,
    title: "Percentage Profit",
    subject: "Economics",
    category: "Business",
    level: "Foundational",

    formula:
      "\\%Profit = \\frac{Profit}{Cost\\ Price} \\times 100",

    explanation:
      "Calculates percentage profit.",

    variables: [
      { symbol: "Profit", meaning: "gain made" },
      { symbol: "Cost Price", meaning: "original amount" },
    ],

    example: "Find percentage profit",
  },

  {
    id: 29,
    title: "Demand Function",
    subject: "Economics",
    category: "Microeconomics",
    level: "University",

    formula:
      "Q_d = a - bP",

    explanation:
      "Shows relationship between price and quantity demanded.",

    variables: [
      { symbol: "Q_d", meaning: "quantity demanded" },
      { symbol: "P", meaning: "price" },
    ],

    example: "Find quantity demanded at price 10",
  },

  {
    id: 30,
    title: "Supply Function",
    subject: "Economics",
    category: "Microeconomics",
    level: "University",

    formula:
      "Q_s = a + bP",

    explanation:
      "Shows relationship between price and quantity supplied.",

    variables: [
      { symbol: "Q_s", meaning: "quantity supplied" },
      { symbol: "P", meaning: "price" },
    ],

    example: "Find quantity supplied at price 20",
  },{
  id: 31,
  title: "First Law of Thermodynamics",
  subject: "Thermodynamics",
  category: "Energy Systems",
  level: "University",

  formula:
    "ΔU = Q - W",

  explanation:
    "The change in internal energy equals heat added minus work done by the system.",

  variables: [
    { symbol: "ΔU", meaning: "change in internal energy" },
    { symbol: "Q", meaning: "heat added" },
    { symbol: "W", meaning: "work done" },
  ],

  example:
    "If 500J of heat is added and 200J of work is done, find ΔU.",
},

{
  id: 32,
  title: "Ideal Gas Equation",
  subject: "Thermodynamics",
  category: "Gas Laws",
  level: "University",

  formula:
    "PV = nRT",

  explanation:
    "Relates pressure, volume, temperature, and amount of gas.",

  variables: [
    { symbol: "P", meaning: "pressure" },
    { symbol: "V", meaning: "volume" },
    { symbol: "n", meaning: "number of moles" },
    { symbol: "R", meaning: "gas constant" },
    { symbol: "T", meaning: "temperature" },
  ],

  example:
    "Calculate pressure when n=2, T=300K, and V=0.5m³.",
},

{
  id: 33,
  title: "Heat Transfer Equation",
  subject: "Thermodynamics",
  category: "Heat Transfer",
  level: "University",

  formula:
    "Q = mcΔT",

  explanation:
    "Determines heat energy transferred during temperature change.",

  variables: [
    { symbol: "Q", meaning: "heat energy" },
    { symbol: "m", meaning: "mass" },
    { symbol: "c", meaning: "specific heat capacity" },
    { symbol: "ΔT", meaning: "temperature change" },
  ],

  example:
    "Find heat needed to raise 2kg of water by 20°C.",
},

{
  id: 34,
  title: "Entropy Change",
  subject: "Thermodynamics",
  category: "Entropy",
  level: "University",

  formula:
    "ΔS = Q/T",

  explanation:
    "Measures change in entropy during heat transfer.",

  variables: [
    { symbol: "ΔS", meaning: "change in entropy" },
    { symbol: "Q", meaning: "heat transfer" },
    { symbol: "T", meaning: "absolute temperature" },
  ],

  example:
    "Calculate entropy change when 100J heat is transferred at 300K.",
},

{
  id: 35,
  title: "Thermal Efficiency",
  subject: "Thermodynamics",
  category: "Heat Engines",
  level: "University",

  formula:
    "η = W/Q_h",

  explanation:
    "Measures efficiency of a heat engine.",

  variables: [
    { symbol: "η", meaning: "thermal efficiency" },
    { symbol: "W", meaning: "work output" },
    { symbol: "Q_h", meaning: "heat input" },
  ],

  example:
    "Find efficiency if engine produces 400J work from 1000J heat.",
},

{
  id: 36,
  title: "Carnot Efficiency",
  subject: "Thermodynamics",
  category: "Heat Engines",
  level: "University",

  formula:
    "η = 1 - (T_c/T_h)",

  explanation:
    "Maximum theoretical efficiency of a heat engine.",

  variables: [
    { symbol: "η", meaning: "efficiency" },
    { symbol: "T_c", meaning: "cold reservoir temperature" },
    { symbol: "T_h", meaning: "hot reservoir temperature" },
  ],

  example:
    "Find Carnot efficiency for T_h=600K and T_c=300K.",
},

{
  id: 37,
  title: "Fourier’s Law",
  subject: "Thermodynamics",
  category: "Heat Conduction",
  level: "University",

  formula:
    "Q/t = -kA(dT/dx)",

  explanation:
    "Describes rate of heat conduction through a material.",

  variables: [
    { symbol: "Q/t", meaning: "heat transfer rate" },
    { symbol: "k", meaning: "thermal conductivity" },
    { symbol: "A", meaning: "cross-sectional area" },
    { symbol: "dT/dx", meaning: "temperature gradient" },
  ],

  example:
    "Determine heat flow through a copper rod.",
},

{
  id: 38,
  title: "Newton’s Law of Cooling",
  subject: "Thermodynamics",
  category: "Cooling Systems",
  level: "University",

  formula:
    "dT/dt = -k(T - T_a)",

  explanation:
    "Rate of cooling is proportional to temperature difference.",

  variables: [
    { symbol: "dT/dt", meaning: "rate of temperature change" },
    { symbol: "k", meaning: "cooling constant" },
    { symbol: "T", meaning: "object temperature" },
    { symbol: "T_a", meaning: "ambient temperature" },
  ],

  example:
    "Find cooling rate of a hot object in air.",
},

{
  id: 39,
  title: "Stefan-Boltzmann Law",
  subject: "Thermodynamics",
  category: "Radiation",
  level: "University",

  formula:
    "P = σAT⁴",

  explanation:
    "Power radiated by a black body depends on temperature.",

  variables: [
    { symbol: "P", meaning: "radiated power" },
    { symbol: "σ", meaning: "Stefan-Boltzmann constant" },
    { symbol: "A", meaning: "surface area" },
    { symbol: "T", meaning: "absolute temperature" },
  ],

  example:
    "Calculate radiation power from a heated plate.",
},

{
  id: 40,
  title: "Coefficient of Performance",
  subject: "Thermodynamics",
  category: "Refrigeration",
  level: "University",

  formula:
    "COP = Q_c/W",

  explanation:
    "Measures performance of refrigerators and heat pumps.",

  variables: [
    { symbol: "COP", meaning: "coefficient of performance" },
    { symbol: "Q_c", meaning: "heat removed" },
    { symbol: "W", meaning: "work input" },
  ],

  example:
    "Find COP when refrigerator removes 500J with 100J work.",
},

{
  id: 41,
  title: "Laplace Transform",
  subject: "Engineering Mathematics",
  category: "Transforms",
  level: "University",

  formula:
    "L{f(t)} = ∫₀^∞ e^(-st)f(t)dt",

  explanation:
    "Transforms time-domain functions into frequency-domain.",

  variables: [
    { symbol: "L", meaning: "Laplace transform" },
    { symbol: "f(t)", meaning: "time-domain function" },
    { symbol: "s", meaning: "complex frequency" },
  ],

  example:
    "Find Laplace transform of f(t)=t².",
},

{
  id: 42,
  title: "Fourier Series",
  subject: "Engineering Mathematics",
  category: "Series",
  level: "University",

  formula:
    "f(x)=a₀+Σ(a_n cos(nx)+b_n sin(nx))",

  explanation:
    "Represents periodic functions as sums of sine and cosine waves.",

  variables: [
    { symbol: "a_n", meaning: "cosine coefficients" },
    { symbol: "b_n", meaning: "sine coefficients" },
    { symbol: "n", meaning: "harmonic number" },
  ],

  example:
    "Expand a square wave using Fourier series.",
},

{
  id: 43,
  title: "Euler’s Formula",
  subject: "Engineering Mathematics",
  category: "Complex Numbers",
  level: "University",

  formula:
    "e^(ix)=cos(x)+i sin(x)",

  explanation:
    "Connects exponential and trigonometric functions.",

  variables: [
    { symbol: "e", meaning: "Euler's number" },
    { symbol: "i", meaning: "imaginary unit" },
    { symbol: "x", meaning: "angle in radians" },
  ],

  example:
    "Express e^(iπ) using Euler's formula.",
},

{
  id: 44,
  title: "Differential Equation",
  subject: "Engineering Mathematics",
  category: "Calculus",
  level: "University",

  formula:
    "dy/dx + Py = Q",

  explanation:
    "Represents a first-order linear differential equation.",

  variables: [
    { symbol: "dy/dx", meaning: "derivative of y" },
    { symbol: "P", meaning: "coefficient function" },
    { symbol: "Q", meaning: "forcing function" },
  ],

  example:
    "Solve dy/dx + 2y = 4.",
},

{
  id: 45,
  title: "Matrix Determinant",
  subject: "Engineering Mathematics",
  category: "Matrices",
  level: "University",

  formula:
    "|A| = ad - bc",

  explanation:
    "Determines determinant of a 2×2 matrix.",

  variables: [
    { symbol: "a,b,c,d", meaning: "matrix elements" },
  ],

  example:
    "Find determinant of [[2,3],[1,4]].",
},

{
  id: 46,
  title: "Eigenvalue Equation",
  subject: "Engineering Mathematics",
  category: "Linear Algebra",
  level: "University",

  formula:
    "Aν = λν",

  explanation:
    "Defines eigenvalues and eigenvectors of a matrix.",

  variables: [
    { symbol: "A", meaning: "matrix" },
    { symbol: "λ", meaning: "eigenvalue" },
    { symbol: "ν", meaning: "eigenvector" },
  ],

  example:
    "Find eigenvalues of a 2×2 matrix.",
},

{
  id: 47,
  title: "Binomial Theorem",
  subject: "Engineering Mathematics",
  category: "Algebra",
  level: "University",

  formula:
    "(a+b)^n = Σ[nCr a^(n-r)b^r]",

  explanation:
    "Expands powers of binomials.",

  variables: [
    { symbol: "nCr", meaning: "combination" },
    { symbol: "a,b", meaning: "terms" },
  ],

  example:
    "Expand (x+2)^4.",
},

{
  id: 48,
  title: "Taylor Series",
  subject: "Engineering Mathematics",
  category: "Series",
  level: "University",

  formula:
    "f(x)=f(a)+f'(a)(x-a)+...",

  explanation:
    "Approximates functions using infinite polynomial series.",

  variables: [
    { symbol: "f(x)", meaning: "function" },
    { symbol: "a", meaning: "expansion point" },
  ],

  example:
    "Approximate sin(x) near x=0.",
},

{
  id: 49,
  title: "Gradient Formula",
  subject: "Engineering Mathematics",
  category: "Vector Calculus",
  level: "University",

  formula:
    "∇f = (∂f/∂x)i + (∂f/∂y)j + (∂f/∂z)k",

  explanation:
    "Represents direction of maximum increase of a scalar field.",

  variables: [
    { symbol: "∇f", meaning: "gradient" },
    { symbol: "i,j,k", meaning: "unit vectors" },
  ],

  example:
    "Find gradient of f=x²+y²+z².",
},

{
  id: 50,
  title: "Divergence Formula",
  subject: "Engineering Mathematics",
  category: "Vector Calculus",
  level: "University",

  formula:
    "∇·F = ∂F_x/∂x + ∂F_y/∂y + ∂F_z/∂z",

  explanation:
    "Measures magnitude of a vector field's source or sink.",

  variables: [
    { symbol: "F", meaning: "vector field" },
    { symbol: "∇·F", meaning: "divergence" },
  ],

  example:
    "Compute divergence of a fluid velocity field.",
},

{
  id: 51,
  title: "Curl Formula",
  subject: "Engineering Mathematics",
  category: "Vector Calculus",
  level: "University",

  formula:
    "∇ × F",

  explanation:
    "Measures rotation of a vector field.",

  variables: [
    { symbol: "∇ × F", meaning: "curl of vector field" },
    { symbol: "F", meaning: "vector field" },
  ],

  example:
    "Find curl of a magnetic field.",
},

{
  id: 52,
  title: "Double Integration",
  subject: "Engineering Mathematics",
  category: "Calculus",
  level: "University",

  formula:
    "∬_R f(x,y)dA",

  explanation:
    "Calculates volume under a surface over a region.",

  variables: [
    { symbol: "f(x,y)", meaning: "surface function" },
    { symbol: "dA", meaning: "area element" },
  ],

  example:
    "Find volume under z=x+y over a square region.",
},

{
  id: 53,
  title: "Triple Integration",
  subject: "Engineering Mathematics",
  category: "Calculus",
  level: "University",

  formula:
    "∭_V f(x,y,z)dV",

  explanation:
    "Computes quantities over three-dimensional regions.",

  variables: [
    { symbol: "f(x,y,z)", meaning: "3D function" },
    { symbol: "dV", meaning: "volume element" },
  ],

  example:
    "Find mass of a solid sphere.",
},

{
  id: 54,
  title: "Probability Density Function",
  subject: "Engineering Mathematics",
  category: "Statistics",
  level: "University",

  formula:
    "f(x) = dF(x)/dx",

  explanation:
    "Represents density of continuous random variables.",

  variables: [
    { symbol: "f(x)", meaning: "probability density" },
    { symbol: "F(x)", meaning: "cumulative distribution function" },
  ],

  example:
    "Determine PDF from a given CDF.",
},

{
  id: 55,
  title: "Normal Distribution",
  subject: "Engineering Mathematics",
  category: "Statistics",
  level: "University",

  formula:
    "f(x)=1/(σ√2π)e^(-(x-μ)²/2σ²)",

  explanation:
    "Describes bell-shaped probability distributions.",

  variables: [
    { symbol: "μ", meaning: "mean" },
    { symbol: "σ", meaning: "standard deviation" },
  ],

  example:
    "Find probability within one standard deviation.",
},

{
  id: 56,
  title: "Ohm’s Law",
  subject: "Electrical Engineering",
  category: "Circuit Analysis",
  level: "University",

  formula:
    "V = IR",

  explanation:
    "Relates voltage, current, and resistance.",

  variables: [
    { symbol: "V", meaning: "voltage" },
    { symbol: "I", meaning: "current" },
    { symbol: "R", meaning: "resistance" },
  ],

  example:
    "Find current when voltage is 12V and resistance is 4Ω.",
},

{
  id: 57,
  title: "Electrical Power",
  subject: "Electrical Engineering",
  category: "Power Systems",
  level: "University",

  formula:
    "P = VI",

  explanation:
    "Calculates electrical power in a circuit.",

  variables: [
    { symbol: "P", meaning: "power" },
    { symbol: "V", meaning: "voltage" },
    { symbol: "I", meaning: "current" },
  ],

  example:
    "Determine power when V=220V and I=5A.",
},

{
  id: 58,
  title: "Capacitor Charge",
  subject: "Electrical Engineering",
  category: "Electronics",
  level: "University",

  formula:
    "Q = CV",

  explanation:
    "Charge stored in a capacitor equals capacitance times voltage.",

  variables: [
    { symbol: "Q", meaning: "charge" },
    { symbol: "C", meaning: "capacitance" },
    { symbol: "V", meaning: "voltage" },
  ],

  example:
    "Find charge stored in a 2F capacitor at 5V.",
},

{
  id: 59,
  title: "Inductive Reactance",
  subject: "Electrical Engineering",
  category: "AC Circuits",
  level: "University",

  formula:
    "X_L = 2πfL",

  explanation:
    "Opposition offered by an inductor in AC circuits.",

  variables: [
    { symbol: "X_L", meaning: "inductive reactance" },
    { symbol: "f", meaning: "frequency" },
    { symbol: "L", meaning: "inductance" },
  ],

  example:
    "Find reactance for L=0.2H at 50Hz.",
},

{
  id: 60,
  title: "Capacitive Reactance",
  subject: "Electrical Engineering",
  category: "AC Circuits",
  level: "University",

  formula:
    "X_C = 1/(2πfC)",

  explanation:
    "Opposition offered by a capacitor in AC circuits.",

  variables: [
    { symbol: "X_C", meaning: "capacitive reactance" },
    { symbol: "f", meaning: "frequency" },
    { symbol: "C", meaning: "capacitance" },
  ],

  example:
    "Determine reactance for C=10μF at 60Hz.",
},

{
  id: 61,
  title: "Transformer Equation",
  subject: "Electrical Engineering",
  category: "Transformers",
  level: "University",

  formula:
    "V_p/V_s = N_p/N_s",

  explanation:
    "Relates transformer voltages and turns ratio.",

  variables: [
    { symbol: "V_p", meaning: "primary voltage" },
    { symbol: "V_s", meaning: "secondary voltage" },
    { symbol: "N_p", meaning: "primary turns" },
    { symbol: "N_s", meaning: "secondary turns" },
  ],

  example:
    "Find secondary voltage for a step-down transformer.",
},

{
  id: 62,
  title: "Mechanical Work",
  subject: "Mechanical Engineering",
  category: "Mechanics",
  level: "University",

  formula:
    "W = Fd",

  explanation:
    "Work done equals force multiplied by displacement.",

  variables: [
    { symbol: "W", meaning: "work done" },
    { symbol: "F", meaning: "force" },
    { symbol: "d", meaning: "displacement" },
  ],

  example:
    "Calculate work done moving an object 5m with 20N force.",
},

{
  id: 63,
  title: "Kinetic Energy",
  subject: "Mechanical Engineering",
  category: "Energy",
  level: "University",

  formula:
    "KE = 1/2mv²",

  explanation:
    "Energy possessed by a moving object.",

  variables: [
    { symbol: "m", meaning: "mass" },
    { symbol: "v", meaning: "velocity" },
  ],

  example:
    "Find kinetic energy of a 10kg object moving at 4m/s.",
},

{
  id: 64,
  title: "Potential Energy",
  subject: "Mechanical Engineering",
  category: "Energy",
  level: "University",

  formula:
    "PE = mgh",

  explanation:
    "Energy possessed due to position in a gravitational field.",

  variables: [
    { symbol: "m", meaning: "mass" },
    { symbol: "g", meaning: "gravitational acceleration" },
    { symbol: "h", meaning: "height" },
  ],

  example:
    "Find potential energy of a 2kg object at 10m height.",
},

{
  id: 65,
  title: "Momentum",
  subject: "Mechanical Engineering",
  category: "Dynamics",
  level: "University",

  formula:
    "p = mv",

  explanation:
    "Momentum equals mass times velocity.",

  variables: [
    { symbol: "p", meaning: "momentum" },
    { symbol: "m", meaning: "mass" },
    { symbol: "v", meaning: "velocity" },
  ],

  example:
    "Find momentum of a 5kg body moving at 8m/s.",
},

{
  id: 66,
  title: "Newton’s Second Law",
  subject: "Mechanical Engineering",
  category: "Dynamics",
  level: "University",

  formula:
    "F = ma",

  explanation:
    "Force equals mass multiplied by acceleration.",

  variables: [
    { symbol: "F", meaning: "force" },
    { symbol: "m", meaning: "mass" },
    { symbol: "a", meaning: "acceleration" },
  ],

  example:
    "Calculate force needed to accelerate a 10kg object at 2m/s².",
},

{
  id: 67,
  title: "Stress Formula",
  subject: "Mechanical Engineering",
  category: "Strength of Materials",
  level: "University",

  formula:
    "σ = F/A",

  explanation:
    "Stress equals force per unit area.",

  variables: [
    { symbol: "σ", meaning: "stress" },
    { symbol: "F", meaning: "force" },
    { symbol: "A", meaning: "cross-sectional area" },
  ],

  example:
    "Find stress on a rod with area 0.01m² carrying 1000N.",
},

{
  id: 68,
  title: "Strain Formula",
  subject: "Mechanical Engineering",
  category: "Strength of Materials",
  level: "University",

  formula:
    "ε = ΔL/L",

  explanation:
    "Measures deformation per unit length.",

  variables: [
    { symbol: "ε", meaning: "strain" },
    { symbol: "ΔL", meaning: "change in length" },
    { symbol: "L", meaning: "original length" },
  ],

  example:
    "Calculate strain for a rod stretched by 2mm from 1m.",
},

{
  id: 69,
  title: "Young’s Modulus",
  subject: "Mechanical Engineering",
  category: "Elasticity",
  level: "University",

  formula:
    "E = σ/ε",

  explanation:
    "Ratio of stress to strain in elastic materials.",

  variables: [
    { symbol: "E", meaning: "Young’s modulus" },
    { symbol: "σ", meaning: "stress" },
    { symbol: "ε", meaning: "strain" },
  ],

  example:
    "Determine modulus when stress is 200MPa and strain is 0.002.",
},

{
  id: 70,
  title: "Bernoulli’s Equation",
  subject: "Fluid Mechanics",
  category: "Fluid Flow",
  level: "University",

  formula:
    "P + 1/2ρv² + ρgh = constant",

  explanation:
    "Relates pressure, velocity, and elevation in fluid flow.",

  variables: [
    { symbol: "P", meaning: "pressure" },
    { symbol: "ρ", meaning: "fluid density" },
    { symbol: "v", meaning: "velocity" },
    { symbol: "g", meaning: "gravitational acceleration" },
    { symbol: "h", meaning: "height" },
  ],

  example:
    "Analyze pressure changes in a flowing pipe.",
},
{
  id: 71,
  title: "Continuity Equation",
  subject: "Fluid Mechanics",
  category: "Fluid Flow",
  level: "University",

  formula:
    "A₁V₁ = A₂V₂",

  explanation:
    "States that the mass flow rate of fluid remains constant in a pipe.",

  variables: [
    { symbol: "A₁", meaning: "area at section 1" },
    { symbol: "V₁", meaning: "velocity at section 1" },
    { symbol: "A₂", meaning: "area at section 2" },
    { symbol: "V₂", meaning: "velocity at section 2" },
  ],

  example:
    "Find fluid velocity in a narrow pipe section.",
},

{
  id: 72,
  title: "Hydrostatic Pressure",
  subject: "Fluid Mechanics",
  category: "Pressure",
  level: "University",

  formula:
    "P = ρgh",

  explanation:
    "Pressure exerted by a fluid due to depth.",

  variables: [
    { symbol: "P", meaning: "pressure" },
    { symbol: "ρ", meaning: "density" },
    { symbol: "g", meaning: "gravitational acceleration" },
    { symbol: "h", meaning: "depth" },
  ],

  example:
    "Determine pressure at 10m underwater.",
},

{
  id: 73,
  title: "Reynolds Number",
  subject: "Fluid Mechanics",
  category: "Flow Analysis",
  level: "University",

  formula:
    "Re = ρVD/μ",

  explanation:
    "Determines whether fluid flow is laminar or turbulent.",

  variables: [
    { symbol: "ρ", meaning: "fluid density" },
    { symbol: "V", meaning: "velocity" },
    { symbol: "D", meaning: "pipe diameter" },
    { symbol: "μ", meaning: "dynamic viscosity" },
  ],

  example:
    "Calculate Reynolds number for water flow in a pipe.",
},

{
  id: 74,
  title: "Pascal’s Law",
  subject: "Fluid Mechanics",
  category: "Hydraulics",
  level: "University",

  formula:
    "F₁/A₁ = F₂/A₂",

  explanation:
    "Pressure applied to an enclosed fluid is transmitted equally.",

  variables: [
    { symbol: "F₁", meaning: "input force" },
    { symbol: "A₁", meaning: "input area" },
    { symbol: "F₂", meaning: "output force" },
    { symbol: "A₂", meaning: "output area" },
  ],

  example:
    "Find lifting force in a hydraulic press.",
},

{
  id: 75,
  title: "Buoyant Force",
  subject: "Fluid Mechanics",
  category: "Buoyancy",
  level: "University",

  formula:
    "F_b = ρgV",

  explanation:
    "Upward force exerted on an object submerged in fluid.",

  variables: [
    { symbol: "F_b", meaning: "buoyant force" },
    { symbol: "ρ", meaning: "fluid density" },
    { symbol: "g", meaning: "gravitational acceleration" },
    { symbol: "V", meaning: "volume displaced" },
  ],

  example:
    "Calculate buoyant force acting on a submerged cube.",
},

{
  id: 76,
  title: "Beam Bending Equation",
  subject: "Civil Engineering",
  category: "Structural Analysis",
  level: "University",

  formula:
    "M/I = σ/y = E/R",

  explanation:
    "Relates bending moment, stress, and curvature in beams.",

  variables: [
    { symbol: "M", meaning: "bending moment" },
    { symbol: "I", meaning: "moment of inertia" },
    { symbol: "σ", meaning: "stress" },
    { symbol: "y", meaning: "distance from neutral axis" },
    { symbol: "E", meaning: "Young's modulus" },
    { symbol: "R", meaning: "radius of curvature" },
  ],

  example:
    "Determine stress in a loaded beam.",
},

{
  id: 77,
  title: "Hooke’s Law",
  subject: "Civil Engineering",
  category: "Elasticity",
  level: "University",

  formula:
    "F = kx",

  explanation:
    "Force exerted by a spring is proportional to displacement.",

  variables: [
    { symbol: "F", meaning: "force" },
    { symbol: "k", meaning: "spring constant" },
    { symbol: "x", meaning: "displacement" },
  ],

  example:
    "Find force needed to stretch a spring by 0.2m.",
},

{
  id: 78,
  title: "Slope Formula",
  subject: "Civil Engineering",
  category: "Surveying",
  level: "University",

  formula:
    "Slope = Rise/Run",

  explanation:
    "Measures steepness or incline of a surface.",

  variables: [
    { symbol: "Rise", meaning: "vertical change" },
    { symbol: "Run", meaning: "horizontal distance" },
  ],

  example:
    "Find slope of a road rising 5m over 100m.",
},

{
  id: 79,
  title: "Shear Stress Formula",
  subject: "Civil Engineering",
  category: "Strength of Materials",
  level: "University",

  formula:
    "τ = F/A",

  explanation:
    "Measures stress parallel to the surface.",

  variables: [
    { symbol: "τ", meaning: "shear stress" },
    { symbol: "F", meaning: "shear force" },
    { symbol: "A", meaning: "area" },
  ],

  example:
    "Calculate shear stress on a bolt.",
},

{
  id: 80,
  title: "Torque Equation",
  subject: "Mechanical Engineering",
  category: "Rotational Mechanics",
  level: "University",

  formula:
    "τ = rF sinθ",

  explanation:
    "Measures turning effect of a force.",

  variables: [
    { symbol: "τ", meaning: "torque" },
    { symbol: "r", meaning: "distance from pivot" },
    { symbol: "F", meaning: "force" },
    { symbol: "θ", meaning: "angle" },
  ],

  example:
    "Find torque produced by a wrench.",
},

{
  id: 81,
  title: "Angular Velocity",
  subject: "Mechanical Engineering",
  category: "Rotational Motion",
  level: "University",

  formula:
    "ω = θ/t",

  explanation:
    "Rate of angular displacement.",

  variables: [
    { symbol: "ω", meaning: "angular velocity" },
    { symbol: "θ", meaning: "angular displacement" },
    { symbol: "t", meaning: "time" },
  ],

  example:
    "Determine angular speed of a rotating wheel.",
},

{
  id: 82,
  title: "Centripetal Force",
  subject: "Mechanical Engineering",
  category: "Circular Motion",
  level: "University",

  formula:
    "F = mv²/r",

  explanation:
    "Force required to keep an object moving in a circle.",

  variables: [
    { symbol: "m", meaning: "mass" },
    { symbol: "v", meaning: "velocity" },
    { symbol: "r", meaning: "radius" },
  ],

  example:
    "Find force acting on a car turning a bend.",
},

{
  id: 83,
  title: "Angular Momentum",
  subject: "Mechanical Engineering",
  category: "Rotational Dynamics",
  level: "University",

  formula:
    "L = Iω",

  explanation:
    "Rotational equivalent of linear momentum.",

  variables: [
    { symbol: "L", meaning: "angular momentum" },
    { symbol: "I", meaning: "moment of inertia" },
    { symbol: "ω", meaning: "angular velocity" },
  ],

  example:
    "Calculate angular momentum of a spinning disc.",
},

{
  id: 84,
  title: "Moment of Inertia",
  subject: "Mechanical Engineering",
  category: "Rotational Dynamics",
  level: "University",

  formula:
    "I = mr²",

  explanation:
    "Measures resistance to rotational acceleration.",

  variables: [
    { symbol: "I", meaning: "moment of inertia" },
    { symbol: "m", meaning: "mass" },
    { symbol: "r", meaning: "radius" },
  ],

  example:
    "Determine inertia of a rotating particle.",
},

{
  id: 85,
  title: "Wave Speed Equation",
  subject: "Physics",
  category: "Waves",
  level: "University",

  formula:
    "v = fλ",

  explanation:
    "Relates wave speed, frequency, and wavelength.",

  variables: [
    { symbol: "v", meaning: "wave speed" },
    { symbol: "f", meaning: "frequency" },
    { symbol: "λ", meaning: "wavelength" },
  ],

  example:
    "Find wave speed when frequency is 50Hz and wavelength is 2m.",
},

{
  id: 86,
  title: "Coulomb’s Law",
  subject: "Physics",
  category: "Electrostatics",
  level: "University",

  formula:
    "F = kq₁q₂/r²",

  explanation:
    "Force between two electric charges.",

  variables: [
    { symbol: "F", meaning: "electrostatic force" },
    { symbol: "k", meaning: "Coulomb constant" },
    { symbol: "q₁", meaning: "first charge" },
    { symbol: "q₂", meaning: "second charge" },
    { symbol: "r", meaning: "distance between charges" },
  ],

  example:
    "Calculate force between two charges separated by 0.5m.",
},

{
  id: 87,
  title: "Electric Field Strength",
  subject: "Physics",
  category: "Electrostatics",
  level: "University",

  formula:
    "E = F/q",

  explanation:
    "Force experienced per unit charge.",

  variables: [
    { symbol: "E", meaning: "electric field strength" },
    { symbol: "F", meaning: "force" },
    { symbol: "q", meaning: "charge" },
  ],

  example:
    "Find electric field acting on a charge.",
},

{
  id: 88,
  title: "Magnetic Force",
  subject: "Physics",
  category: "Magnetism",
  level: "University",

  formula:
    "F = qvB sinθ",

  explanation:
    "Force acting on a moving charge in a magnetic field.",

  variables: [
    { symbol: "q", meaning: "charge" },
    { symbol: "v", meaning: "velocity" },
    { symbol: "B", meaning: "magnetic field strength" },
    { symbol: "θ", meaning: "angle" },
  ],

  example:
    "Determine force on an electron moving in a magnetic field.",
},

{
  id: 89,
  title: "Faraday’s Law",
  subject: "Physics",
  category: "Electromagnetic Induction",
  level: "University",

  formula:
    "ε = -dΦ/dt",

  explanation:
    "Induced emf equals rate of change of magnetic flux.",

  variables: [
    { symbol: "ε", meaning: "induced emf" },
    { symbol: "Φ", meaning: "magnetic flux" },
    { symbol: "t", meaning: "time" },
  ],

  example:
    "Calculate emf induced in a coil.",
},

{
  id: 90,
  title: "Snell’s Law",
  subject: "Physics",
  category: "Optics",
  level: "University",

  formula:
    "n₁ sinθ₁ = n₂ sinθ₂",

  explanation:
    "Describes refraction of light between media.",

  variables: [
    { symbol: "n₁", meaning: "refractive index of first medium" },
    { symbol: "θ₁", meaning: "incident angle" },
    { symbol: "n₂", meaning: "refractive index of second medium" },
    { symbol: "θ₂", meaning: "refracted angle" },
  ],

  example:
    "Find refracted angle when light enters water.",
},
{
  id: 151,
  title: "Fourier Series",
  subject: "Engineering Mathematics",
  category: "Fourier Analysis",
  level: "University",

  formula:
    "f(x) = a₀/2 + Σ(aₙcos(nx) + bₙsin(nx))",

  explanation:
    "Represents periodic functions as sums of sine and cosine waves.",

  variables: [
    { symbol: "a₀", meaning: "average coefficient" },
    { symbol: "aₙ", meaning: "cosine coefficients" },
    { symbol: "bₙ", meaning: "sine coefficients" },
    { symbol: "n", meaning: "harmonic number" },
  ],

  example:
    "Used in vibration and signal analysis.",
},

{
  id: 152,
  title: "Laplace Transform",
  subject: "Engineering Mathematics",
  category: "Transforms",
  level: "University",

  formula:
    "L{f(t)} = ∫₀∞ e⁻ˢᵗ f(t) dt",

  explanation:
    "Transforms differential equations into algebraic equations.",

  variables: [
    { symbol: "f(t)", meaning: "time-domain function" },
    { symbol: "s", meaning: "complex frequency" },
  ],

  example:
    "Transform e⁻²ᵗ into Laplace domain.",
},

{
  id: 153,
  title: "Inverse Laplace Transform",
  subject: "Engineering Mathematics",
  category: "Transforms",
  level: "University",

  formula:
    "f(t) = L⁻¹{F(s)}",

  explanation:
    "Converts Laplace-domain equations back to time domain.",

  variables: [
    { symbol: "F(s)", meaning: "Laplace function" },
    { symbol: "f(t)", meaning: "time-domain function" },
  ],

  example:
    "Find inverse transform of 1/(s+2).",
},

{
  id: 154,
  title: "Taylor Series",
  subject: "Engineering Mathematics",
  category: "Series Expansion",
  level: "University",

  formula:
    "f(x) = f(a) + f'(a)(x-a) + f''(a)(x-a)²/2! + ...",

  explanation:
    "Approximates functions using infinite polynomial expansions.",

  variables: [
    { symbol: "f(a)", meaning: "function value at a" },
    { symbol: "f'(a)", meaning: "first derivative" },
  ],

  example:
    "Approximate sin(x) around x = 0.",
},

{
  id: 155,
  title: "Maclaurin Series",
  subject: "Engineering Mathematics",
  category: "Series Expansion",
  level: "University",

  formula:
    "f(x) = f(0) + f'(0)x + f''(0)x²/2! + ...",

  explanation:
    "Taylor series centered at zero.",

  variables: [
    { symbol: "x", meaning: "independent variable" },
  ],

  example:
    "Expand eˣ as a power series.",
},

{
  id: 156,
  title: "Gradient of Scalar Field",
  subject: "Engineering Mathematics",
  category: "Vector Calculus",
  level: "University",

  formula:
    "∇f = (∂f/∂x)i + (∂f/∂y)j + (∂f/∂z)k",

  explanation:
    "Measures rate and direction of maximum increase.",

  variables: [
    { symbol: "∇f", meaning: "gradient vector" },
    { symbol: "f", meaning: "scalar field" },
  ],

  example:
    "Find gradient of temperature field.",
},

{
  id: 157,
  title: "Divergence",
  subject: "Engineering Mathematics",
  category: "Vector Calculus",
  level: "University",

  formula:
    "∇ · F = ∂Fₓ/∂x + ∂Fᵧ/∂y + ∂F_z/∂z",

  explanation:
    "Measures outward flux density of a vector field.",

  variables: [
    { symbol: "F", meaning: "vector field" },
  ],

  example:
    "Compute divergence of fluid velocity.",
},

{
  id: 158,
  title: "Curl",
  subject: "Engineering Mathematics",
  category: "Vector Calculus",
  level: "University",

  formula:
    "∇ × F",

  explanation:
    "Measures rotational tendency of a vector field.",

  variables: [
    { symbol: "F", meaning: "vector field" },
  ],

  example:
    "Find curl of electromagnetic field.",
},

{
  id: 159,
  title: "Green's Theorem",
  subject: "Engineering Mathematics",
  category: "Vector Calculus",
  level: "University",

  formula:
    "∮C (Ldx + Mdy) = ∬R (∂M/∂x - ∂L/∂y)dA",

  explanation:
    "Relates line integrals to double integrals.",

  variables: [
    { symbol: "L, M", meaning: "scalar functions" },
  ],

  example:
    "Evaluate circulation around a curve.",
},

{
  id: 160,
  title: "Stokes' Theorem",
  subject: "Engineering Mathematics",
  category: "Vector Calculus",
  level: "University",

  formula:
    "∮C F·dr = ∬S (∇ × F)·dS",

  explanation:
    "Relates circulation around boundary to curl over surface.",

  variables: [
    { symbol: "F", meaning: "vector field" },
  ],

  example:
    "Calculate magnetic circulation.",
},

{
  id: 161,
  title: "Gauss Divergence Theorem",
  subject: "Engineering Mathematics",
  category: "Vector Calculus",
  level: "University",

  formula:
    "∭V (∇ · F)dV = ∬S F·dS",

  explanation:
    "Relates divergence within volume to flux through surface.",

  variables: [
    { symbol: "F", meaning: "vector field" },
  ],

  example:
    "Determine total outward flux.",
},

{
  id: 162,
  title: "Eigenvalue Equation",
  subject: "Engineering Mathematics",
  category: "Linear Algebra",
  level: "University",

  formula:
    "A𝑥 = λ𝑥",

  explanation:
    "Defines eigenvalues and eigenvectors of a matrix.",

  variables: [
    { symbol: "A", meaning: "matrix" },
    { symbol: "λ", meaning: "eigenvalue" },
    { symbol: "x", meaning: "eigenvector" },
  ],

  example:
    "Find eigenvalues of 2×2 matrix.",
},

{
  id: 163,
  title: "Determinant of 2×2 Matrix",
  subject: "Engineering Mathematics",
  category: "Linear Algebra",
  level: "University",

  formula:
    "|A| = ad - bc",

  explanation:
    "Computes determinant of a 2×2 matrix.",

  variables: [
    { symbol: "a,b,c,d", meaning: "matrix entries" },
  ],

  example:
    "Find determinant of [[2,3],[1,4]].",
},

{
  id: 164,
  title: "Matrix Inverse",
  subject: "Engineering Mathematics",
  category: "Linear Algebra",
  level: "University",

  formula:
    "A⁻¹ = adj(A)/|A|",

  explanation:
    "Calculates inverse of a square matrix.",

  variables: [
    { symbol: "adj(A)", meaning: "adjoint matrix" },
    { symbol: "|A|", meaning: "determinant" },
  ],

  example:
    "Find inverse of 2×2 matrix.",
},

{
  id: 165,
  title: "Binomial Distribution",
  subject: "Engineering Mathematics",
  category: "Probability",
  level: "University",

  formula:
    "P(X=k) = nCk pᵏ(1-p)ⁿ⁻ᵏ",

  explanation:
    "Probability of exactly k successes in n trials.",

  variables: [
    { symbol: "n", meaning: "number of trials" },
    { symbol: "p", meaning: "success probability" },
  ],

  example:
    "Probability of getting 3 heads in 5 tosses.",
},

{
  id: 166,
  title: "Poisson Distribution",
  subject: "Engineering Mathematics",
  category: "Probability",
  level: "University",

  formula:
    "P(X=k) = (λᵏe⁻ˡ)/k!",

  explanation:
    "Models rare random events.",

  variables: [
    { symbol: "λ", meaning: "average rate" },
  ],

  example:
    "Find probability of 2 calls per minute.",
},

{
  id: 167,
  title: "Normal Distribution",
  subject: "Engineering Mathematics",
  category: "Statistics",
  level: "University",

  formula:
    "f(x) = (1/σ√2π)e^(-(x-μ)²/2σ²)",

  explanation:
    "Probability density function of Gaussian distribution.",

  variables: [
    { symbol: "μ", meaning: "mean" },
    { symbol: "σ", meaning: "standard deviation" },
  ],

  example:
    "Find probability within one standard deviation.",
},

{
  id: 168,
  title: "Z-Score",
  subject: "Engineering Mathematics",
  category: "Statistics",
  level: "University",

  formula:
    "z = (x - μ)/σ",

  explanation:
    "Measures how many standard deviations a value is from the mean.",

  variables: [
    { symbol: "x", meaning: "observed value" },
    { symbol: "μ", meaning: "mean" },
    { symbol: "σ", meaning: "standard deviation" },
  ],

  example:
    "Calculate z-score for score 80.",
},

{
  id: 169,
  title: "Correlation Coefficient",
  subject: "Engineering Mathematics",
  category: "Statistics",
  level: "University",

  formula:
    "r = Σ[(x-ẍ)(y-ẏ)] / √[Σ(x-ẍ)²Σ(y-ẏ)²]",

  explanation:
    "Measures linear relationship between variables.",

  variables: [
    { symbol: "r", meaning: "correlation coefficient" },
  ],

  example:
    "Determine correlation between study time and scores.",
},

{
  id: 170,
  title: "Regression Equation",
  subject: "Engineering Mathematics",
  category: "Statistics",
  level: "University",

  formula:
    "y = a + bx",

  explanation:
    "Linear regression model for prediction.",

  variables: [
    { symbol: "a", meaning: "intercept" },
    { symbol: "b", meaning: "slope" },
  ],

  example:
    "Predict sales based on advertising.",
},

{
  id: 171,
  title: "Hooke's Law",
  subject: "Mechanics",
  category: "Elasticity",
  level: "University",

  formula:
    "F = -kx",

  explanation:
    "Restoring force is proportional to displacement.",

  variables: [
    { symbol: "F", meaning: "restoring force" },
    { symbol: "k", meaning: "spring constant" },
    { symbol: "x", meaning: "displacement" },
  ],

  example:
    "Find spring force for extension 0.2m.",
},

{
  id: 172,
  title: "Stress Formula",
  subject: "Mechanics",
  category: "Strength of Materials",
  level: "University",

  formula:
    "σ = F/A",

  explanation:
    "Stress equals force per unit area.",

  variables: [
    { symbol: "σ", meaning: "stress" },
    { symbol: "F", meaning: "force" },
    { symbol: "A", meaning: "cross-sectional area" },
  ],

  example:
    "Calculate stress on steel rod.",
},

{
  id: 173,
  title: "Strain Formula",
  subject: "Mechanics",
  category: "Strength of Materials",
  level: "University",

  formula:
    "ε = ΔL/L",

  explanation:
    "Strain is deformation divided by original length.",

  variables: [
    { symbol: "ΔL", meaning: "change in length" },
    { symbol: "L", meaning: "original length" },
  ],

  example:
    "Find strain in stretched wire.",
},

{
  id: 174,
  title: "Young's Modulus",
  subject: "Mechanics",
  category: "Elasticity",
  level: "University",

  formula:
    "E = σ/ε",

  explanation:
    "Ratio of stress to strain.",

  variables: [
    { symbol: "σ", meaning: "stress" },
    { symbol: "ε", meaning: "strain" },
  ],

  example:
    "Determine elasticity of material.",
},

{
  id: 175,
  title: "Torque Formula",
  subject: "Mechanics",
  category: "Rotational Motion",
  level: "University",

  formula:
    "τ = rFsinθ",

  explanation:
    "Torque produced by a force acting at distance r.",

  variables: [
    { symbol: "τ", meaning: "torque" },
    { symbol: "r", meaning: "radius" },
    { symbol: "F", meaning: "force" },
  ],

  example:
    "Find torque on a wrench.",
},
{
  id: 176,
  title: "Angular Velocity",
  subject: "Mechanics",
  category: "Rotational Motion",
  level: "University",

  formula:
    "ω = θ/t",

  explanation:
    "Angular displacement per unit time.",

  variables: [
    { symbol: "ω", meaning: "angular velocity" },
    { symbol: "θ", meaning: "angular displacement" },
    { symbol: "t", meaning: "time" },
  ],

  example:
    "Find angular velocity after rotating 6 radians in 2 seconds.",
},

{
  id: 177,
  title: "Angular Acceleration",
  subject: "Mechanics",
  category: "Rotational Motion",
  level: "University",

  formula:
    "α = Δω/Δt",

  explanation:
    "Rate of change of angular velocity.",

  variables: [
    { symbol: "α", meaning: "angular acceleration" },
    { symbol: "Δω", meaning: "change in angular velocity" },
    { symbol: "Δt", meaning: "change in time" },
  ],

  example:
    "Calculate angular acceleration of a spinning wheel.",
},

{
  id: 178,
  title: "Rotational Kinetic Energy",
  subject: "Mechanics",
  category: "Rotational Motion",
  level: "University",

  formula:
    "KE = 1/2 Iω²",

  explanation:
    "Energy possessed by a rotating object.",

  variables: [
    { symbol: "I", meaning: "moment of inertia" },
    { symbol: "ω", meaning: "angular velocity" },
  ],

  example:
    "Find kinetic energy of a rotating disk.",
},

{
  id: 179,
  title: "Moment of Inertia",
  subject: "Mechanics",
  category: "Rotational Motion",
  level: "University",

  formula:
    "I = mr²",

  explanation:
    "Resistance of a body to rotational acceleration.",

  variables: [
    { symbol: "m", meaning: "mass" },
    { symbol: "r", meaning: "radius" },
  ],

  example:
    "Determine inertia of a particle rotating about an axis.",
},

{
  id: 180,
  title: "Centripetal Force",
  subject: "Mechanics",
  category: "Circular Motion",
  level: "University",

  formula:
    "F = mv²/r",

  explanation:
    "Force required to keep an object moving in a circle.",

  variables: [
    { symbol: "m", meaning: "mass" },
    { symbol: "v", meaning: "velocity" },
    { symbol: "r", meaning: "radius" },
  ],

  example:
    "Find force acting on a car turning a bend.",
},

{
  id: 181,
  title: "Centripetal Acceleration",
  subject: "Mechanics",
  category: "Circular Motion",
  level: "University",

  formula:
    "a = v²/r",

  explanation:
    "Acceleration directed toward the center of a circle.",

  variables: [
    { symbol: "v", meaning: "velocity" },
    { symbol: "r", meaning: "radius" },
  ],

  example:
    "Calculate acceleration of a rotating object.",
},

{
  id: 182,
  title: "Impulse Formula",
  subject: "Mechanics",
  category: "Momentum",
  level: "University",

  formula:
    "J = Ft",

  explanation:
    "Impulse equals force multiplied by time.",

  variables: [
    { symbol: "J", meaning: "impulse" },
    { symbol: "F", meaning: "force" },
    { symbol: "t", meaning: "time" },
  ],

  example:
    "Find impulse applied over 3 seconds.",
},

{
  id: 183,
  title: "Momentum Formula",
  subject: "Mechanics",
  category: "Momentum",
  level: "University",

  formula:
    "p = mv",

  explanation:
    "Momentum equals mass times velocity.",

  variables: [
    { symbol: "p", meaning: "momentum" },
    { symbol: "m", meaning: "mass" },
    { symbol: "v", meaning: "velocity" },
  ],

  example:
    "Calculate momentum of a moving truck.",
},

{
  id: 184,
  title: "Work Done",
  subject: "Mechanics",
  category: "Energy",
  level: "University",

  formula:
    "W = Fdcosθ",

  explanation:
    "Work done by a force over displacement.",

  variables: [
    { symbol: "F", meaning: "force" },
    { symbol: "d", meaning: "displacement" },
    { symbol: "θ", meaning: "angle between force and displacement" },
  ],

  example:
    "Find work done pulling an object.",
},

{
  id: 185,
  title: "Power Formula",
  subject: "Mechanics",
  category: "Energy",
  level: "University",

  formula:
    "P = W/t",

  explanation:
    "Power is the rate of doing work.",

  variables: [
    { symbol: "P", meaning: "power" },
    { symbol: "W", meaning: "work done" },
    { symbol: "t", meaning: "time" },
  ],

  example:
    "Calculate machine power output.",
},

{
  id: 186,
  title: "Gravitational Potential Energy",
  subject: "Mechanics",
  category: "Energy",
  level: "University",

  formula:
    "PE = mgh",

  explanation:
    "Energy stored due to height above ground.",

  variables: [
    { symbol: "m", meaning: "mass" },
    { symbol: "g", meaning: "gravitational acceleration" },
    { symbol: "h", meaning: "height" },
  ],

  example:
    "Find energy of object lifted 5m high.",
},

{
  id: 187,
  title: "Kinetic Energy",
  subject: "Mechanics",
  category: "Energy",
  level: "University",

  formula:
    "KE = 1/2 mv²",

  explanation:
    "Energy possessed by moving objects.",

  variables: [
    { symbol: "m", meaning: "mass" },
    { symbol: "v", meaning: "velocity" },
  ],

  example:
    "Calculate kinetic energy of a car.",
},

{
  id: 188,
  title: "Bernoulli Equation",
  subject: "Fluid Mechanics",
  category: "Fluid Flow",
  level: "University",

  formula:
    "P + 1/2ρv² + ρgh = constant",

  explanation:
    "Conservation of energy in fluid flow.",

  variables: [
    { symbol: "P", meaning: "pressure" },
    { symbol: "ρ", meaning: "fluid density" },
    { symbol: "v", meaning: "velocity" },
    { symbol: "h", meaning: "height" },
  ],

  example:
    "Determine pressure difference in flowing fluid.",
},

{
  id: 189,
  title: "Continuity Equation",
  subject: "Fluid Mechanics",
  category: "Fluid Flow",
  level: "University",

  formula:
    "A₁v₁ = A₂v₂",

  explanation:
    "Mass conservation in incompressible fluid flow.",

  variables: [
    { symbol: "A", meaning: "cross-sectional area" },
    { symbol: "v", meaning: "fluid velocity" },
  ],

  example:
    "Find velocity through narrow pipe.",
},

{
  id: 190,
  title: "Pascal's Law",
  subject: "Fluid Mechanics",
  category: "Pressure",
  level: "University",

  formula:
    "P = F/A",

  explanation:
    "Pressure applied to enclosed fluid is transmitted equally.",

  variables: [
    { symbol: "P", meaning: "pressure" },
    { symbol: "F", meaning: "force" },
    { symbol: "A", meaning: "area" },
  ],

  example:
    "Calculate hydraulic lift pressure.",
},

{
  id: 191,
  title: "Buoyant Force",
  subject: "Fluid Mechanics",
  category: "Buoyancy",
  level: "University",

  formula:
    "F_b = ρgV",

  explanation:
    "Upward force exerted by fluid on immersed body.",

  variables: [
    { symbol: "ρ", meaning: "fluid density" },
    { symbol: "g", meaning: "gravitational acceleration" },
    { symbol: "V", meaning: "volume displaced" },
  ],

  example:
    "Find buoyant force on submerged object.",
},

{
  id: 192,
  title: "Reynolds Number",
  subject: "Fluid Mechanics",
  category: "Fluid Flow",
  level: "University",

  formula:
    "Re = ρvD/μ",

  explanation:
    "Predicts laminar or turbulent flow.",

  variables: [
    { symbol: "ρ", meaning: "density" },
    { symbol: "v", meaning: "velocity" },
    { symbol: "D", meaning: "diameter" },
    { symbol: "μ", meaning: "viscosity" },
  ],

  example:
    "Determine whether pipe flow is turbulent.",
},

{
  id: 193,
  title: "Heat Transfer Equation",
  subject: "Thermodynamics",
  category: "Heat Transfer",
  level: "University",

  formula:
    "Q = mcΔT",

  explanation:
    "Heat energy required to change temperature.",

  variables: [
    { symbol: "m", meaning: "mass" },
    { symbol: "c", meaning: "specific heat capacity" },
    { symbol: "ΔT", meaning: "temperature change" },
  ],

  example:
    "Find heat required to warm water.",
},

{
  id: 194,
  title: "First Law of Thermodynamics",
  subject: "Thermodynamics",
  category: "Laws of Thermodynamics",
  level: "University",

  formula:
    "ΔU = Q - W",

  explanation:
    "Energy conservation in thermodynamic systems.",

  variables: [
    { symbol: "ΔU", meaning: "change in internal energy" },
    { symbol: "Q", meaning: "heat supplied" },
    { symbol: "W", meaning: "work done" },
  ],

  example:
    "Calculate internal energy change.",
},

{
  id: 195,
  title: "Ideal Gas Equation",
  subject: "Thermodynamics",
  category: "Gas Laws",
  level: "University",

  formula:
    "PV = nRT",

  explanation:
    "Relates pressure, volume, and temperature of gases.",

  variables: [
    { symbol: "P", meaning: "pressure" },
    { symbol: "V", meaning: "volume" },
    { symbol: "n", meaning: "moles" },
    { symbol: "R", meaning: "gas constant" },
    { symbol: "T", meaning: "temperature" },
  ],

  example:
    "Determine gas pressure at fixed temperature.",
},

{
  id: 196,
  title: "Efficiency of Heat Engine",
  subject: "Thermodynamics",
  category: "Heat Engines",
  level: "University",

  formula:
    "η = W/Q_h",

  explanation:
    "Ratio of useful work output to heat input.",

  variables: [
    { symbol: "η", meaning: "efficiency" },
    { symbol: "W", meaning: "work output" },
    { symbol: "Q_h", meaning: "heat supplied" },
  ],

  example:
    "Calculate engine efficiency.",
},

{
  id: 197,
  title: "Carnot Efficiency",
  subject: "Thermodynamics",
  category: "Heat Engines",
  level: "University",

  formula:
    "η = 1 - T_c/T_h",

  explanation:
    "Maximum possible efficiency of a heat engine.",

  variables: [
    { symbol: "T_c", meaning: "cold reservoir temperature" },
    { symbol: "T_h", meaning: "hot reservoir temperature" },
  ],

  example:
    "Find ideal efficiency between two temperatures.",
},

{
  id: 198,
  title: "Entropy Change",
  subject: "Thermodynamics",
  category: "Entropy",
  level: "University",

  formula:
    "ΔS = Q/T",

  explanation:
    "Measures disorder or randomness in a system.",

  variables: [
    { symbol: "ΔS", meaning: "entropy change" },
    { symbol: "Q", meaning: "heat transferred" },
    { symbol: "T", meaning: "temperature" },
  ],

  example:
    "Calculate entropy increase during heating.",
},

{
  id: 199,
  title: "Stefan-Boltzmann Law",
  subject: "Thermodynamics",
  category: "Radiation",
  level: "University",

  formula:
    "P = σAT⁴",

  explanation:
    "Radiated power emitted by a black body.",

  variables: [
    { symbol: "σ", meaning: "Stefan-Boltzmann constant" },
    { symbol: "A", meaning: "surface area" },
    { symbol: "T", meaning: "temperature" },
  ],

  example:
    "Find heat radiated from hot object.",
},

{
  id: 200,
  title: "Wien's Displacement Law",
  subject: "Thermodynamics",
  category: "Radiation",
  level: "University",

  formula:
    "λ_max T = constant",

  explanation:
    "Peak wavelength inversely proportional to temperature.",

  variables: [
    { symbol: "λ_max", meaning: "peak wavelength" },
    { symbol: "T", meaning: "absolute temperature" },
  ],

  example:
    "Determine color emitted by hot metal.",
},
  {
    id: 201,
    title: "Quadratic Formula",
    subject: "Mathematics",
    category: "Algebra",
    level: "Foundational",

    formula:
      "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",

    explanation:
      "Used for solving quadratic equations.",

    variables: [
      { symbol: "a", meaning: "coefficient of x²" },
      { symbol: "b", meaning: "coefficient of x" },
      { symbol: "c", meaning: "constant" },
    ],

    example:
      "Solve x² + 5x + 6 = 0",
  },

  {
    id: 202,
    title: "Pythagorean Theorem",
    subject: "Mathematics",
    category: "Geometry",
    level: "Foundational",

    formula:
      "a^2 + b^2 = c^2",

    explanation:
      "Relationship between the sides of a right triangle.",

    variables: [
      { symbol: "a", meaning: "adjacent side" },
      { symbol: "b", meaning: "opposite side" },
      { symbol: "c", meaning: "hypotenuse" },
    ],

    example:
      "Find c when a = 3 and b = 4",
  },

  {
    id: 203,
    title: "Area of Circle",
    subject: "Mathematics",
    category: "Geometry",
    level: "Foundational",

    formula:
      "A = \\pi r^2",

    explanation:
      "Used to calculate the area of a circle.",

    variables: [
      { symbol: "A", meaning: "area" },
      { symbol: "r", meaning: "radius" },
    ],

    example:
      "Find area when r = 7cm",
  },

  {
    id: 204,
    title: "Slope Formula",
    subject: "Mathematics",
    category: "Coordinate Geometry",
    level: "University",

    formula:
      "m = \\frac{y_2 - y_1}{x_2 - x_1}",

    explanation:
      "Used to calculate slope between two points.",

    variables: [
      { symbol: "m", meaning: "slope" },
      { symbol: "x_1", meaning: "first x-coordinate" },
      { symbol: "x_2", meaning: "second x-coordinate" },
      { symbol: "y_1", meaning: "first y-coordinate" },
      { symbol: "y_2", meaning: "second y-coordinate" },
    ],

    example:
      "Find slope between (2,3) and (5,9)",
  },

  {
    id: 205,
    title: "Simple Interest",
    subject: "Mathematics",
    category: "Financial Maths",
    level: "Foundational",

    formula:
      "SI = \\frac{PRT}{100}",

    explanation:
      "Used to calculate simple interest.",

    variables: [
      { symbol: "P", meaning: "principal" },
      { symbol: "R", meaning: "rate" },
      { symbol: "T", meaning: "time" },
    ],

    example:
      "Find SI when P = 1000, R = 5%, T = 2",
  },

  {
    id: 206,
    title: "Ohm's Law",
    subject: "Physics",
    category: "Electricity",
    level: "Foundational",

    formula:
      "V = IR",

    explanation:
      "Relationship between voltage, current and resistance.",

    variables: [
      { symbol: "V", meaning: "voltage" },
      { symbol: "I", meaning: "current" },
      { symbol: "R", meaning: "resistance" },
    ],

    example:
      "Find voltage when I = 2A and R = 5Ω",
  },

  {
    id: 207,
    title: "Newton's Second Law",
    subject: "Physics",
    category: "Mechanics",
    level: "WAEC",

    formula:
      "F = ma",

    explanation:
      "Force equals mass multiplied by acceleration.",

    variables: [
      { symbol: "F", meaning: "force" },
      { symbol: "m", meaning: "mass" },
      { symbol: "a", meaning: "acceleration" },
    ],

    example:
      "Find force when m = 5kg and a = 2m/s²",
  },

  {
    id: 208,
    title: "Kinetic Energy",
    subject: "Physics",
    category: "Energy",
    level: "University",

    formula:
      "KE = \\frac{1}{2}mv^2",

    explanation:
      "Energy possessed by a moving body.",

    variables: [
      { symbol: "m", meaning: "mass" },
      { symbol: "v", meaning: "velocity" },
    ],

    example:
      "Find KE of a 2kg object moving at 4m/s",
  },

  {
    id: 209,
    title: "Momentum Formula",
    subject: "Physics",
    category: "Mechanics",
    level: "WAEC",

    formula:
      "p = mv",

    explanation:
      "Momentum equals mass multiplied by velocity.",

    variables: [
      { symbol: "p", meaning: "momentum" },
      { symbol: "m", meaning: "mass" },
      { symbol: "v", meaning: "velocity" },
    ],

    example:
      "Find momentum when m = 4kg and v = 3m/s",
  },

  {
    id: 210,
    title: "Wien's Displacement Law",
    subject: "Physics",
    category: "Radiation",
    level: "University",

    formula:
      "λ_{max} T = constant",

    explanation:
      "Peak wavelength inversely proportional to temperature.",

    variables: [
      { symbol: "λ_max", meaning: "peak wavelength" },
      { symbol: "T", meaning: "absolute temperature" },
    ],

    example:
      "Determine color emitted by hot metal.",
  },
    {
    id: 211,
    title: "Potential Energy",
    subject: "Physics",
    category: "Energy",
    level: "University",

    formula:
      "PE = mgh",

    explanation:
      "Energy possessed due to height above ground.",

    variables: [
      { symbol: "m", meaning: "mass" },
      { symbol: "g", meaning: "gravitational acceleration" },
      { symbol: "h", meaning: "height" },
    ],

    example:
      "Find PE when m = 2kg, h = 5m",
  },

  {
    id: 212,
    title: "Speed Formula",
    subject: "Physics",
    category: "Motion",
    level: "Foundational",

    formula:
      "Speed = \\frac{Distance}{Time}",

    explanation:
      "Calculates speed of a moving object.",

    variables: [
      { symbol: "Distance", meaning: "distance travelled" },
      { symbol: "Time", meaning: "time taken" },
    ],

    example:
      "Find speed if distance = 100m and time = 20s",
  },

  {
    id: 213,
    title: "Density Formula",
    subject: "Physics",
    category: "Matter",
    level: "WAEC",

    formula:
      "\\rho = \\frac{m}{V}",

    explanation:
      "Density equals mass divided by volume.",

    variables: [
      { symbol: "\\rho", meaning: "density" },
      { symbol: "m", meaning: "mass" },
      { symbol: "V", meaning: "volume" },
    ],

    example:
      "Find density when mass = 20kg and volume = 5m³",
  },

  {
    id: 214,
    title: "Pressure Formula",
    subject: "Physics",
    category: "Mechanics",
    level: "Foundational",

    formula:
      "P = \\frac{F}{A}",

    explanation:
      "Pressure equals force divided by area.",

    variables: [
      { symbol: "P", meaning: "pressure" },
      { symbol: "F", meaning: "force" },
      { symbol: "A", meaning: "area" },
    ],

    example:
      "Find pressure when F = 50N and A = 5m²",
  },

  {
    id: 215,
    title: "Power Formula",
    subject: "Physics",
    category: "Energy",
    level: "WAEC",

    formula:
      "P = \\frac{W}{t}",

    explanation:
      "Power equals work done divided by time.",

    variables: [
      { symbol: "P", meaning: "power" },
      { symbol: "W", meaning: "work done" },
      { symbol: "t", meaning: "time" },
    ],

    example:
      "Find power if W = 200J and t = 10s",
  },

  {
    id: 216,
    title: "Work Done",
    subject: "Physics",
    category: "Mechanics",
    level: "Foundational",

    formula:
      "W = Fs",

    explanation:
      "Work done equals force multiplied by distance.",

    variables: [
      { symbol: "W", meaning: "work done" },
      { symbol: "F", meaning: "force" },
      { symbol: "s", meaning: "distance" },
    ],

    example:
      "Find work done when F = 10N and s = 5m",
  },

  {
    id: 217,
    title: "Circumference of Circle",
    subject: "Mathematics",
    category: "Geometry",
    level: "Foundational",

    formula:
      "C = 2\\pi r",

    explanation:
      "Used to calculate circumference of a circle.",

    variables: [
      { symbol: "C", meaning: "circumference" },
      { symbol: "r", meaning: "radius" },
    ],

    example:
      "Find circumference when r = 7cm",
  },

  {
    id: 218,
    title: "Area of Triangle",
    subject: "Mathematics",
    category: "Geometry",
    level: "WAEC",

    formula:
      "A = \\frac{1}{2}bh",

    explanation:
      "Area equals half base multiplied by height.",

    variables: [
      { symbol: "b", meaning: "base" },
      { symbol: "h", meaning: "height" },
    ],

    example:
      "Find area when b = 10cm and h = 8cm",
  },

  {
    id: 219,
    title: "Volume of Cylinder",
    subject: "Mathematics",
    category: "Mensuration",
    level: "University",

    formula:
      "V = \\pi r^2 h",

    explanation:
      "Calculates volume of a cylinder.",

    variables: [
      { symbol: "V", meaning: "volume" },
      { symbol: "r", meaning: "radius" },
      { symbol: "h", meaning: "height" },
    ],

    example:
      "Find volume when r = 3cm and h = 10cm",
  },

  {
    id: 220,
    title: "Trigonometric Identity",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "University",

    formula:
      "\\sin^2\\theta + \\cos^2\\theta = 1",

    explanation:
      "Fundamental trigonometric identity.",

    variables: [
      { symbol: "\\theta", meaning: "angle" },
    ],

    example:
      "Verify identity for θ = 45°",
  },
    {
    id: 221,
    title: "Probability Formula",
    subject: "Mathematics",
    category: "Probability",
    level: "WAEC",

    formula:
      "P(E) = \\frac{n(E)}{n(S)}",

    explanation:
      "Probability equals favorable outcomes over total outcomes.",

    variables: [
      { symbol: "P(E)", meaning: "probability of event E" },
      { symbol: "n(E)", meaning: "number of favorable outcomes" },
      { symbol: "n(S)", meaning: "total sample space" },
    ],

    example:
      "Find probability of getting a head from a coin toss",
  },

  {
    id: 222,
    title: "Mean Formula",
    subject: "Mathematics",
    category: "Statistics",
    level: "Foundational",

    formula:
      "\\bar{x} = \\frac{\\sum x}{n}",

    explanation:
      "Calculates arithmetic mean.",

    variables: [
      { symbol: "\\bar{x}", meaning: "mean" },
      { symbol: "\\sum x", meaning: "sum of observations" },
      { symbol: "n", meaning: "number of observations" },
    ],

    example:
      "Find mean of 2, 4, 6, 8",
  },

  {
    id: 223,
    title: "Compound Interest",
    subject: "Mathematics",
    category: "Financial Maths",
    level: "University",

    formula:
      "A = P\\left(1 + \\frac{r}{n}\\right)^{nt}",

    explanation:
      "Used to calculate compound interest.",

    variables: [
      { symbol: "A", meaning: "final amount" },
      { symbol: "P", meaning: "principal" },
      { symbol: "r", meaning: "interest rate" },
      { symbol: "n", meaning: "times compounded yearly" },
      { symbol: "t", meaning: "time" },
    ],

    example:
      "Find amount after 2 years",
  },

  {
    id: 224,
    title: "Distance Formula",
    subject: "Mathematics",
    category: "Coordinate Geometry",
    level: "University",

    formula:
      "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}",

    explanation:
      "Calculates distance between two points.",

    variables: [
      { symbol: "d", meaning: "distance" },
      { symbol: "x_1", meaning: "first x-coordinate" },
      { symbol: "x_2", meaning: "second x-coordinate" },
      { symbol: "y_1", meaning: "first y-coordinate" },
      { symbol: "y_2", meaning: "second y-coordinate" },
    ],

    example:
      "Find distance between (1,2) and (4,6)",
  },

  {
    id: 225,
    title: "Acceleration Formula",
    subject: "Physics",
    category: "Motion",
    level: "Foundational",

    formula:
      "a = \\frac{v - u}{t}",

    explanation:
      "Acceleration equals change in velocity over time.",

    variables: [
      { symbol: "a", meaning: "acceleration" },
      { symbol: "v", meaning: "final velocity" },
      { symbol: "u", meaning: "initial velocity" },
      { symbol: "t", meaning: "time" },
    ],

    example:
      "Find acceleration when u=2m/s, v=10m/s, t=4s",
  },

  {
    id: 226,
    title: "Wave Speed Formula",
    subject: "Physics",
    category: "Waves",
    level: "WAEC",

    formula:
      "v = f\\lambda",

    explanation:
      "Wave speed equals frequency multiplied by wavelength.",

    variables: [
      { symbol: "v", meaning: "wave speed" },
      { symbol: "f", meaning: "frequency" },
      { symbol: "\\lambda", meaning: "wavelength" },
    ],

    example:
      "Find speed when f=50Hz and λ=2m",
  },

  {
    id: 227,
    title: "Hooke's Law",
    subject: "Physics",
    category: "Elasticity",
    level: "University",

    formula:
      "F = kx",

    explanation:
      "Force applied to a spring is proportional to extension.",

    variables: [
      { symbol: "F", meaning: "force" },
      { symbol: "k", meaning: "spring constant" },
      { symbol: "x", meaning: "extension" },
    ],

    example:
      "Find force when k=200N/m and x=0.5m",
  },

  {
    id: 228,
    title: "Lens Formula",
    subject: "Physics",
    category: "Optics",
    level: "University",

    formula:
      "\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}",

    explanation:
      "Relates focal length, image distance and object distance.",

    variables: [
      { symbol: "f", meaning: "focal length" },
      { symbol: "v", meaning: "image distance" },
      { symbol: "u", meaning: "object distance" },
    ],

    example:
      "Find focal length when u=20cm and v=30cm",
  },

  {
    id: 229,
    title: "Gravitational Force",
    subject: "Physics",
    category: "Gravitation",
    level: "University",

    formula:
      "F = G\\frac{m_1m_2}{r^2}",

    explanation:
      "Force between two masses.",

    variables: [
      { symbol: "F", meaning: "gravitational force" },
      { symbol: "G", meaning: "gravitational constant" },
      { symbol: "m_1", meaning: "first mass" },
      { symbol: "m_2", meaning: "second mass" },
      { symbol: "r", meaning: "distance between masses" },
    ],

    example:
      "Find force between two masses separated by distance",
  },

  {
    id: 230,
    title: "Current Formula",
    subject: "Physics",
    category: "Electricity",
    level: "WAEC",

    formula:
      "I = \\frac{Q}{t}",

    explanation:
      "Current equals charge divided by time.",

    variables: [
      { symbol: "I", meaning: "current" },
      { symbol: "Q", meaning: "charge" },
      { symbol: "t", meaning: "time" },
    ],

    example:
      "Find current when Q=20C and t=5s",
  },
    {
    id: 231,
    title: "Capacitance Formula",
    subject: "Physics",
    category: "Electricity",
    level: "University",

    formula:
      "C = \\frac{Q}{V}",

    explanation:
      "Capacitance equals charge stored per unit voltage.",

    variables: [
      { symbol: "C", meaning: "capacitance" },
      { symbol: "Q", meaning: "charge" },
      { symbol: "V", meaning: "voltage" },
    ],

    example:
      "Find capacitance when Q=10C and V=5V",
  },

  {
    id: 232,
    title: "Coulomb's Law",
    subject: "Physics",
    category: "Electrostatics",
    level: "University",

    formula:
      "F = k\\frac{q_1q_2}{r^2}",

    explanation:
      "Force between two electric charges.",

    variables: [
      { symbol: "F", meaning: "electrostatic force" },
      { symbol: "k", meaning: "electrostatic constant" },
      { symbol: "q_1", meaning: "first charge" },
      { symbol: "q_2", meaning: "second charge" },
      { symbol: "r", meaning: "distance between charges" },
    ],

    example:
      "Find force between two charges separated by distance",
  },

  {
    id: 233,
    title: "Resistivity Formula",
    subject: "Physics",
    category: "Electricity",
    level: "University",

    formula:
      "R = \\rho\\frac{L}{A}",

    explanation:
      "Resistance depends on resistivity, length and area.",

    variables: [
      { symbol: "R", meaning: "resistance" },
      { symbol: "\\rho", meaning: "resistivity" },
      { symbol: "L", meaning: "length" },
      { symbol: "A", meaning: "cross-sectional area" },
    ],

    example:
      "Find resistance of a wire",
  },

  {
    id: 234,
    title: "Escape Velocity",
    subject: "Physics",
    category: "Gravitation",
    level: "University",

    formula:
      "v = \\sqrt{\\frac{2GM}{R}}",

    explanation:
      "Minimum velocity needed to escape a planet.",

    variables: [
      { symbol: "v", meaning: "escape velocity" },
      { symbol: "G", meaning: "gravitational constant" },
      { symbol: "M", meaning: "mass of planet" },
      { symbol: "R", meaning: "radius of planet" },
    ],

    example:
      "Find escape velocity of Earth",
  },

  {
    id: 235,
    title: "Area of Trapezium",
    subject: "Mathematics",
    category: "Geometry",
    level: "WAEC",

    formula:
      "A = \\frac{1}{2}(a+b)h",

    explanation:
      "Area equals half the sum of parallel sides times height.",

    variables: [
      { symbol: "A", meaning: "area" },
      { symbol: "a", meaning: "first parallel side" },
      { symbol: "b", meaning: "second parallel side" },
      { symbol: "h", meaning: "height" },
    ],

    example:
      "Find area when a=5cm, b=9cm, h=4cm",
  },

  {
    id: 236,
    title: "Surface Area of Sphere",
    subject: "Mathematics",
    category: "Mensuration",
    level: "University",

    formula:
      "A = 4\\pi r^2",

    explanation:
      "Calculates surface area of a sphere.",

    variables: [
      { symbol: "A", meaning: "surface area" },
      { symbol: "r", meaning: "radius" },
    ],

    example:
      "Find surface area when r=7cm",
  },

  {
    id: 237,
    title: "Volume of Sphere",
    subject: "Mathematics",
    category: "Mensuration",
    level: "University",

    formula:
      "V = \\frac{4}{3}\\pi r^3",

    explanation:
      "Calculates volume of a sphere.",

    variables: [
      { symbol: "V", meaning: "volume" },
      { symbol: "r", meaning: "radius" },
    ],

    example:
      "Find volume when r=3cm",
  },

  {
    id: 238,
    title: "Binomial Expansion",
    subject: "Mathematics",
    category: "Algebra",
    level: "University",

    formula:
      "(a+b)^2 = a^2 + 2ab + b^2",

    explanation:
      "Expansion of a binomial squared.",

    variables: [
      { symbol: "a", meaning: "first term" },
      { symbol: "b", meaning: "second term" },
    ],

    example:
      "Expand (x+2)^2",
  },

  {
    id: 239,
    title: "Logarithm Law",
    subject: "Mathematics",
    category: "Logarithm",
    level: "WAEC",

    formula:
      "\\log(ab) = \\log a + \\log b",

    explanation:
      "Logarithm of a product equals sum of logarithms.",

    variables: [
      { symbol: "a", meaning: "first value" },
      { symbol: "b", meaning: "second value" },
    ],

    example:
      "Simplify log(2×5)",
  },

  {
    id: 240,
    title: "Permutation Formula",
    subject: "Mathematics",
    category: "Probability",
    level: "University",

    formula:
      "nP_r = \\frac{n!}{(n-r)!}",

    explanation:
      "Calculates arrangements of objects.",

    variables: [
      { symbol: "n", meaning: "total objects" },
      { symbol: "r", meaning: "objects selected" },
    ],

    example:
      "Find permutations of 5 objects taken 2",
  },

  {
    id: 241,
    title: "Combination Formula",
    subject: "Mathematics",
    category: "Probability",
    level: "University",

    formula:
      "nC_r = \\frac{n!}{r!(n-r)!}",

    explanation:
      "Calculates combinations of objects.",

    variables: [
      { symbol: "n", meaning: "total objects" },
      { symbol: "r", meaning: "objects selected" },
    ],

    example:
      "Find combinations of 6 objects taken 3",
  },

  {
    id: 242,
    title: "Exponential Law",
    subject: "Mathematics",
    category: "Algebra",
    level: "Foundational",

    formula:
      "a^m \\times a^n = a^{m+n}",

    explanation:
      "Indices law for multiplication.",

    variables: [
      { symbol: "a", meaning: "base" },
      { symbol: "m", meaning: "first exponent" },
      { symbol: "n", meaning: "second exponent" },
    ],

    example:
      "Simplify x² × x³",
  },

  {
    id: 243,
    title: "Sine Rule",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "University",

    formula:
      "\\frac{a}{\\sin A} = \\frac{b}{\\sin B}",

    explanation:
      "Relates sides and angles of a triangle.",

    variables: [
      { symbol: "a", meaning: "first side" },
      { symbol: "b", meaning: "second side" },
      { symbol: "A", meaning: "first angle" },
      { symbol: "B", meaning: "second angle" },
    ],

    example:
      "Find unknown side using sine rule",
  },

  {
    id: 244,
    title: "Cosine Rule",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "University",

    formula:
      "c^2 = a^2 + b^2 - 2ab\\cos C",

    explanation:
      "Used to solve non-right angled triangles.",

    variables: [
      { symbol: "a", meaning: "first side" },
      { symbol: "b", meaning: "second side" },
      { symbol: "c", meaning: "third side" },
      { symbol: "C", meaning: "included angle" },
    ],

    example:
      "Find side c when a=5, b=7, C=60°",
  },

  {
    id: 245,
    title: "Equation of Circle",
    subject: "Mathematics",
    category: "Coordinate Geometry",
    level: "University",

    formula:
      "(x-h)^2 + (y-k)^2 = r^2",

    explanation:
      "Standard equation of a circle.",

    variables: [
      { symbol: "h", meaning: "x-coordinate of center" },
      { symbol: "k", meaning: "y-coordinate of center" },
      { symbol: "r", meaning: "radius" },
    ],

    example:
      "Find equation of circle with center (2,3) and radius 5",
  },
    {
    id: 246,
    title: "Differentiation Formula",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",

    formula:
      "\\frac{d}{dx}(x^n) = nx^{n-1}",

    explanation:
      "Basic rule for differentiating powers.",

    variables: [
      { symbol: "n", meaning: "power of x" },
      { symbol: "x", meaning: "variable" },
    ],

    example:
      "Differentiate x^5",
  },

  {
    id: 247,
    title: "Integration Formula",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",

    formula:
      "\\int x^n dx = \\frac{x^{n+1}}{n+1} + C",

    explanation:
      "Basic integration formula for powers.",

    variables: [
      { symbol: "n", meaning: "power of x" },
      { symbol: "C", meaning: "constant of integration" },
    ],

    example:
      "Integrate x² dx",
  },

  {
    id: 248,
    title: "Area Under Curve",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",

    formula:
      "A = \\int_a^b f(x)dx",

    explanation:
      "Calculates area under a graph.",

    variables: [
      { symbol: "A", meaning: "area" },
      { symbol: "f(x)", meaning: "function" },
      { symbol: "a", meaning: "lower limit" },
      { symbol: "b", meaning: "upper limit" },
    ],

    example:
      "Find area under y=x² from 0 to 2",
  },

  {
    id: 249,
    title: "Matrix Determinant",
    subject: "Mathematics",
    category: "Matrices",
    level: "University",

    formula:
      "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc",

    explanation:
      "Formula for determinant of 2×2 matrix.",

    variables: [
      { symbol: "a,b,c,d", meaning: "matrix elements" },
    ],

    example:
      "Find determinant of [[2,3],[4,5]]",
  },

  {
    id: 250,
    title: "Arithmetic Progression",
    subject: "Mathematics",
    category: "Sequence",
    level: "WAEC",

    formula:
      "a_n = a + (n-1)d",

    explanation:
      "Finds nth term of arithmetic sequence.",

    variables: [
      { symbol: "a_n", meaning: "nth term" },
      { symbol: "a", meaning: "first term" },
      { symbol: "d", meaning: "common difference" },
      { symbol: "n", meaning: "term number" },
    ],

    example:
      "Find 10th term when a=2 and d=3",
  },

  {
    id: 251,
    title: "Geometric Progression",
    subject: "Mathematics",
    category: "Sequence",
    level: "WAEC",

    formula:
      "a_n = ar^{n-1}",

    explanation:
      "Finds nth term of geometric sequence.",

    variables: [
      { symbol: "a_n", meaning: "nth term" },
      { symbol: "a", meaning: "first term" },
      { symbol: "r", meaning: "common ratio" },
    ],

    example:
      "Find 5th term when a=3 and r=2",
  },

  {
    id: 252,
    title: "Sum of Arithmetic Series",
    subject: "Mathematics",
    category: "Sequence",
    level: "University",

    formula:
      "S_n = \\frac{n}{2}[2a+(n-1)d]",

    explanation:
      "Calculates sum of arithmetic series.",

    variables: [
      { symbol: "S_n", meaning: "sum of series" },
      { symbol: "n", meaning: "number of terms" },
      { symbol: "a", meaning: "first term" },
      { symbol: "d", meaning: "common difference" },
    ],

    example:
      "Find sum of first 20 terms",
  },

  {
    id: 253,
    title: "Sum of Geometric Series",
    subject: "Mathematics",
    category: "Sequence",
    level: "University",

    formula:
      "S_n = a\\frac{1-r^n}{1-r}",

    explanation:
      "Calculates sum of geometric progression.",

    variables: [
      { symbol: "S_n", meaning: "sum of series" },
      { symbol: "a", meaning: "first term" },
      { symbol: "r", meaning: "common ratio" },
    ],

    example:
      "Find sum when a=2, r=3, n=4",
  },

  {
    id: 254,
    title: "Standard Deviation",
    subject: "Mathematics",
    category: "Statistics",
    level: "University",

    formula:
      "\\sigma = \\sqrt{\\frac{\\sum (x-\\bar{x})^2}{n}}",

    explanation:
      "Measures spread of data values.",

    variables: [
      { symbol: "\\sigma", meaning: "standard deviation" },
      { symbol: "x", meaning: "data values" },
      { symbol: "\\bar{x}", meaning: "mean" },
      { symbol: "n", meaning: "number of values" },
    ],

    example:
      "Find standard deviation of a dataset",
  },

  {
    id: 255,
    title: "Variance Formula",
    subject: "Mathematics",
    category: "Statistics",
    level: "University",

    formula:
      "\\sigma^2 = \\frac{\\sum (x-\\bar{x})^2}{n}",

    explanation:
      "Measures variability in data.",

    variables: [
      { symbol: "\\sigma^2", meaning: "variance" },
      { symbol: "x", meaning: "data value" },
      { symbol: "\\bar{x}", meaning: "mean" },
    ],

    example:
      "Calculate variance of scores",
  },

  {
    id: 256,
    title: "Ideal Gas Law",
    subject: "Physics",
    category: "Thermodynamics",
    level: "University",

    formula:
      "PV = nRT",

    explanation:
      "Relates pressure, volume and temperature of gases.",

    variables: [
      { symbol: "P", meaning: "pressure" },
      { symbol: "V", meaning: "volume" },
      { symbol: "n", meaning: "number of moles" },
      { symbol: "R", meaning: "gas constant" },
      { symbol: "T", meaning: "temperature" },
    ],

    example:
      "Find pressure when volume and temperature are known",
  },

  {
    id: 257,
    title: "Boyle's Law",
    subject: "Physics",
    category: "Thermodynamics",
    level: "WAEC",

    formula:
      "P_1V_1 = P_2V_2",

    explanation:
      "Pressure inversely proportional to volume.",

    variables: [
      { symbol: "P_1", meaning: "initial pressure" },
      { symbol: "V_1", meaning: "initial volume" },
      { symbol: "P_2", meaning: "final pressure" },
      { symbol: "V_2", meaning: "final volume" },
    ],

    example:
      "Find new pressure after compression",
  },

  {
    id: 258,
    title: "Charles' Law",
    subject: "Physics",
    category: "Thermodynamics",
    level: "WAEC",

    formula:
      "\\frac{V_1}{T_1} = \\frac{V_2}{T_2}",

    explanation:
      "Volume directly proportional to temperature.",

    variables: [
      { symbol: "V_1", meaning: "initial volume" },
      { symbol: "T_1", meaning: "initial temperature" },
      { symbol: "V_2", meaning: "final volume" },
      { symbol: "T_2", meaning: "final temperature" },
    ],

    example:
      "Find new volume after heating gas",
  },

  {
    id: 259,
    title: "Specific Heat Capacity",
    subject: "Physics",
    category: "Heat",
    level: "University",

    formula:
      "Q = mc\\Delta T",

    explanation:
      "Heat energy required to raise temperature.",

    variables: [
      { symbol: "Q", meaning: "heat energy" },
      { symbol: "m", meaning: "mass" },
      { symbol: "c", meaning: "specific heat capacity" },
      { symbol: "\\Delta T", meaning: "temperature change" },
    ],

    example:
      "Find heat needed to raise water temperature",
  },

  {
    id: 260,
    title: "Frequency Formula",
    subject: "Physics",
    category: "Waves",
    level: "WAEC",

    formula:
      "f = \\frac{1}{T}",

    explanation:
      "Frequency equals reciprocal of time period.",

    variables: [
      { symbol: "f", meaning: "frequency" },
      { symbol: "T", meaning: "time period" },
    ],

    example:
      "Find frequency when T=0.02s",
  },
    {
    id: 261,
    title: "Time Period of Pendulum",
    subject: "Physics",
    category: "Oscillation",
    level: "University",

    formula:
      "T = 2\\pi\\sqrt{\\frac{l}{g}}",

    explanation:
      "Calculates time period of a simple pendulum.",

    variables: [
      { symbol: "T", meaning: "time period" },
      { symbol: "l", meaning: "length of pendulum" },
      { symbol: "g", meaning: "gravitational acceleration" },
    ],

    example:
      "Find period when l = 1m",
  },

  {
    id: 262,
    title: "Angular Velocity",
    subject: "Physics",
    category: "Circular Motion",
    level: "University",

    formula:
      "\\omega = \\frac{\\theta}{t}",

    explanation:
      "Angular displacement per unit time.",

    variables: [
      { symbol: "\\omega", meaning: "angular velocity" },
      { symbol: "\\theta", meaning: "angular displacement" },
      { symbol: "t", meaning: "time" },
    ],

    example:
      "Find angular velocity for θ=10rad in 2s",
  },

  {
    id: 263,
    title: "Centripetal Force",
    subject: "Physics",
    category: "Circular Motion",
    level: "University",

    formula:
      "F = \\frac{mv^2}{r}",

    explanation:
      "Force acting towards center of circular path.",

    variables: [
      { symbol: "m", meaning: "mass" },
      { symbol: "v", meaning: "velocity" },
      { symbol: "r", meaning: "radius" },
    ],

    example:
      "Find force when m=2kg, v=4m/s, r=3m",
  },

  {
    id: 264,
    title: "Magnetic Force",
    subject: "Physics",
    category: "Magnetism",
    level: "University",

    formula:
      "F = BIL\\sin\\theta",

    explanation:
      "Force on a current carrying conductor in magnetic field.",

    variables: [
      { symbol: "B", meaning: "magnetic flux density" },
      { symbol: "I", meaning: "current" },
      { symbol: "L", meaning: "length" },
      { symbol: "\\theta", meaning: "angle" },
    ],

    example:
      "Find force when B=2T, I=3A, L=4m",
  },

  {
    id: 265,
    title: "Transformer Equation",
    subject: "Physics",
    category: "Electricity",
    level: "University",

    formula:
      "\\frac{V_p}{V_s} = \\frac{N_p}{N_s}",

    explanation:
      "Relates voltages and turns in transformer.",

    variables: [
      { symbol: "V_p", meaning: "primary voltage" },
      { symbol: "V_s", meaning: "secondary voltage" },
      { symbol: "N_p", meaning: "primary turns" },
      { symbol: "N_s", meaning: "secondary turns" },
    ],

    example:
      "Find secondary voltage in transformer",
  },

  {
    id: 266,
    title: "Snell's Law",
    subject: "Physics",
    category: "Optics",
    level: "University",

    formula:
      "n_1\\sin\\theta_1 = n_2\\sin\\theta_2",

    explanation:
      "Describes refraction of light.",

    variables: [
      { symbol: "n_1", meaning: "first refractive index" },
      { symbol: "n_2", meaning: "second refractive index" },
      { symbol: "\\theta_1", meaning: "incident angle" },
      { symbol: "\\theta_2", meaning: "refracted angle" },
    ],

    example:
      "Find refracted angle in glass",
  },

  {
    id: 267,
    title: "Mirror Formula",
    subject: "Physics",
    category: "Optics",
    level: "University",

    formula:
      "\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v}",

    explanation:
      "Relates focal length, object distance and image distance.",

    variables: [
      { symbol: "f", meaning: "focal length" },
      { symbol: "u", meaning: "object distance" },
      { symbol: "v", meaning: "image distance" },
    ],

    example:
      "Find focal length of mirror",
  },

  {
    id: 268,
    title: "Efficiency Formula",
    subject: "Physics",
    category: "Machines",
    level: "WAEC",

    formula:
      "\\eta = \\frac{Useful\\ Output}{Input} \\times 100",

    explanation:
      "Measures machine efficiency.",

    variables: [
      { symbol: "\\eta", meaning: "efficiency" },
    ],

    example:
      "Find efficiency if output is 80J and input is 100J",
  },

  {
    id: 269,
    title: "Mechanical Advantage",
    subject: "Physics",
    category: "Machines",
    level: "WAEC",

    formula:
      "MA = \\frac{Load}{Effort}",

    explanation:
      "Measures force multiplication of machine.",

    variables: [
      { symbol: "Load", meaning: "output force" },
      { symbol: "Effort", meaning: "input force" },
    ],

    example:
      "Find MA when load=200N and effort=50N",
  },

  {
    id: 270,
    title: "Velocity Equation",
    subject: "Physics",
    category: "Motion",
    level: "Foundational",

    formula:
      "v = u + at",

    explanation:
      "First equation of motion.",

    variables: [
      { symbol: "v", meaning: "final velocity" },
      { symbol: "u", meaning: "initial velocity" },
      { symbol: "a", meaning: "acceleration" },
      { symbol: "t", meaning: "time" },
    ],

    example:
      "Find final velocity after acceleration",
  },

  {
    id: 271,
    title: "Displacement Equation",
    subject: "Physics",
    category: "Motion",
    level: "Foundational",

    formula:
      "s = ut + \\frac{1}{2}at^2",

    explanation:
      "Second equation of motion.",

    variables: [
      { symbol: "s", meaning: "displacement" },
      { symbol: "u", meaning: "initial velocity" },
      { symbol: "a", meaning: "acceleration" },
      { symbol: "t", meaning: "time" },
    ],

    example:
      "Find displacement after 5 seconds",
  },

  {
    id: 272,
    title: "Velocity-Displacement Equation",
    subject: "Physics",
    category: "Motion",
    level: "WAEC",

    formula:
      "v^2 = u^2 + 2as",

    explanation:
      "Third equation of motion.",

    variables: [
      { symbol: "v", meaning: "final velocity" },
      { symbol: "u", meaning: "initial velocity" },
      { symbol: "a", meaning: "acceleration" },
      { symbol: "s", meaning: "displacement" },
    ],

    example:
      "Find velocity after moving 20m",
  },

  {
    id: 273,
    title: "Equation of Straight Line",
    subject: "Mathematics",
    category: "Coordinate Geometry",
    level: "WAEC",

    formula:
      "y = mx + c",

    explanation:
      "General equation of a straight line.",

    variables: [
      { symbol: "m", meaning: "slope" },
      { symbol: "c", meaning: "y-intercept" },
    ],

    example:
      "Find equation with slope 2 and intercept 3",
  },

  {
    id: 274,
    title: "Midpoint Formula",
    subject: "Mathematics",
    category: "Coordinate Geometry",
    level: "WAEC",

    formula:
      "\\left(\\frac{x_1+x_2}{2},\\frac{y_1+y_2}{2}\\right)",

    explanation:
      "Finds midpoint between two points.",

    variables: [
      { symbol: "x_1,x_2", meaning: "x-coordinates" },
      { symbol: "y_1,y_2", meaning: "y-coordinates" },
    ],

    example:
      "Find midpoint of (2,4) and (6,8)",
  },

  {
    id: 275,
    title: "Heron's Formula",
    subject: "Mathematics",
    category: "Geometry",
    level: "University",

    formula:
      "A = \\sqrt{s(s-a)(s-b)(s-c)}",

    explanation:
      "Calculates area of triangle using sides.",

    variables: [
      { symbol: "A", meaning: "area" },
      { symbol: "s", meaning: "semi-perimeter" },
      { symbol: "a,b,c", meaning: "triangle sides" },
    ],

    example:
      "Find area when sides are 3,4,5",
  },
    {
    id: 276,
    title: "Molarity Formula",
    subject: "Chemistry",
    category: "Concentration",
    level: "University",

    formula:
      "M = \\frac{n}{V}",

    explanation:
      "Molarity equals number of moles divided by volume.",

    variables: [
      { symbol: "M", meaning: "molarity" },
      { symbol: "n", meaning: "number of moles" },
      { symbol: "V", meaning: "volume in dm³" },
    ],

    example:
      "Find molarity when n = 2mol and V = 0.5dm³",
  },

  {
    id: 277,
    title: "Density Formula",
    subject: "Chemistry",
    category: "Physical Chemistry",
    level: "WAEC",

    formula:
      "\\rho = \\frac{m}{V}",

    explanation:
      "Density equals mass divided by volume.",

    variables: [
      { symbol: "\\rho", meaning: "density" },
      { symbol: "m", meaning: "mass" },
      { symbol: "V", meaning: "volume" },
    ],

    example:
      "Find density when mass = 10g and volume = 2cm³",
  },

  {
    id: 278,
    title: "Percentage Yield",
    subject: "Chemistry",
    category: "Stoichiometry",
    level: "University",

    formula:
      "\\%\\ Yield = \\frac{Actual\\ Yield}{Theoretical\\ Yield} \\times 100",

    explanation:
      "Measures efficiency of chemical reaction.",

    variables: [
      { symbol: "Actual Yield", meaning: "experimental yield" },
      { symbol: "Theoretical Yield", meaning: "expected yield" },
    ],

    example:
      "Find percentage yield if actual = 8g and theoretical = 10g",
  },

  {
    id: 279,
    title: "Ideal Gas Equation",
    subject: "Chemistry",
    category: "Gas Laws",
    level: "University",

    formula:
      "PV = nRT",

    explanation:
      "Relates pressure, volume, temperature and moles.",

    variables: [
      { symbol: "P", meaning: "pressure" },
      { symbol: "V", meaning: "volume" },
      { symbol: "n", meaning: "number of moles" },
      { symbol: "R", meaning: "gas constant" },
      { symbol: "T", meaning: "temperature" },
    ],

    example:
      "Find pressure of gas in a container",
  },

  {
    id: 280,
    title: "pH Formula",
    subject: "Chemistry",
    category: "Acids and Bases",
    level: "University",

    formula:
      "pH = -\\log[H^+]",

    explanation:
      "Measures acidity of a solution.",

    variables: [
      { symbol: "[H^+]", meaning: "hydrogen ion concentration" },
    ],

    example:
      "Find pH when [H⁺] = 1 × 10⁻³",
  },

  {
    id: 281,
    title: "Avogadro's Formula",
    subject: "Chemistry",
    category: "Atomic Structure",
    level: "WAEC",

    formula:
      "N = nN_A",

    explanation:
      "Calculates number of particles in substance.",

    variables: [
      { symbol: "N", meaning: "number of particles" },
      { symbol: "n", meaning: "number of moles" },
      { symbol: "N_A", meaning: "Avogadro's constant" },
    ],

    example:
      "Find particles in 2 moles of oxygen",
  },

  {
    id: 282,
    title: "Empirical Formula",
    subject: "Chemistry",
    category: "Stoichiometry",
    level: "University",

    formula:
      "\\text{Empirical Formula} = \\frac{Mole\\ Ratio}{Smallest\\ Ratio}",

    explanation:
      "Used to determine simplest ratio of atoms.",

    variables: [
      { symbol: "Mole Ratio", meaning: "ratio of moles" },
    ],

    example:
      "Find empirical formula from percentage composition",
  },

  {
    id: 283,
    title: "Faraday's Law",
    subject: "Chemistry",
    category: "Electrochemistry",
    level: "University",

    formula:
      "m = \\frac{Q}{F} \\times \\frac{M}{z}",

    explanation:
      "Mass deposited during electrolysis.",

    variables: [
      { symbol: "m", meaning: "mass deposited" },
      { symbol: "Q", meaning: "charge" },
      { symbol: "F", meaning: "Faraday constant" },
      { symbol: "M", meaning: "molar mass" },
      { symbol: "z", meaning: "valency" },
    ],

    example:
      "Find copper deposited during electrolysis",
  },

  {
    id: 284,
    title: "Rate of Reaction",
    subject: "Chemistry",
    category: "Chemical Kinetics",
    level: "University",

    formula:
      "Rate = \\frac{\\Delta Quantity}{\\Delta Time}",

    explanation:
      "Measures speed of chemical reaction.",

    variables: [
      { symbol: "\\Delta Quantity", meaning: "change in amount" },
      { symbol: "\\Delta Time", meaning: "time interval" },
    ],

    example:
      "Find reaction rate from experiment data",
  },

  {
    id: 285,
    title: "Nernst Equation",
    subject: "Chemistry",
    category: "Electrochemistry",
    level: "University",

    formula:
      "E = E^\\circ - \\frac{0.0591}{n}\\log Q",

    explanation:
      "Calculates cell potential under non-standard conditions.",

    variables: [
      { symbol: "E", meaning: "cell potential" },
      { symbol: "E^\\circ", meaning: "standard potential" },
      { symbol: "n", meaning: "electrons transferred" },
      { symbol: "Q", meaning: "reaction quotient" },
    ],

    example:
      "Find electrode potential in a cell",
  },

  {
    id: 286,
    title: "Maclaurin Series",
    subject: "Further Mathematics",
    category: "Series",
    level: "University",

    formula:
      "f(x)=f(0)+xf'(0)+\\frac{x^2}{2!}f''(0)+...",

    explanation:
      "Expansion of function about x = 0.",

    variables: [
      { symbol: "f(x)", meaning: "function" },
      { symbol: "x", meaning: "variable" },
    ],

    example:
      "Expand e^x using Maclaurin series",
  },

  {
    id: 287,
    title: "Binomial Theorem",
    subject: "Further Mathematics",
    category: "Algebra",
    level: "University",

    formula:
      "(a+b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k}b^k",

    explanation:
      "Expands powers of binomials.",

    variables: [
      { symbol: "n", meaning: "power" },
      { symbol: "a,b", meaning: "terms" },
    ],

    example:
      "Expand (x+1)^5",
  },

  {
    id: 288,
    title: "Differential Equation",
    subject: "Further Mathematics",
    category: "Calculus",
    level: "University",

    formula:
      "\\frac{dy}{dx} = ky",

    explanation:
      "Basic first-order differential equation.",

    variables: [
      { symbol: "y", meaning: "dependent variable" },
      { symbol: "x", meaning: "independent variable" },
      { symbol: "k", meaning: "constant" },
    ],

    example:
      "Solve dy/dx = 3y",
  },

  {
    id: 289,
    title: "Hyperbolic Identity",
    subject: "Further Mathematics",
    category: "Hyperbolic Functions",
    level: "University",

    formula:
      "\\cosh^2 x - \\sinh^2 x = 1",

    explanation:
      "Fundamental hyperbolic identity.",

    variables: [
      { symbol: "x", meaning: "variable" },
    ],

    example:
      "Verify identity for x = 2",
  },

  {
    id: 290,
    title: "Vector Magnitude",
    subject: "Further Mathematics",
    category: "Vectors",
    level: "University",

    formula:
      "|\\vec{a}| = \\sqrt{x^2 + y^2 + z^2}",

    explanation:
      "Calculates magnitude of vector.",

    variables: [
      { symbol: "x,y,z", meaning: "vector components" },
    ],

    example:
      "Find magnitude of vector (2,3,6)",
  },

  {
    id: 291,
    title: "Dot Product",
    subject: "Further Mathematics",
    category: "Vectors",
    level: "University",

    formula:
      "\\vec{a} \\cdot \\vec{b} = |a||b|\\cos\\theta",

    explanation:
      "Calculates scalar product of vectors.",

    variables: [
      { symbol: "\\vec{a}", meaning: "first vector" },
      { symbol: "\\vec{b}", meaning: "second vector" },
      { symbol: "\\theta", meaning: "angle between vectors" },
    ],

    example:
      "Find dot product of two vectors",
  },

  {
    id: 292,
    title: "Cross Product",
    subject: "Further Mathematics",
    category: "Vectors",
    level: "University",

    formula:
      "|\\vec{a} \\times \\vec{b}| = |a||b|\\sin\\theta",

    explanation:
      "Calculates vector product magnitude.",

    variables: [
      { symbol: "\\vec{a}", meaning: "first vector" },
      { symbol: "\\vec{b}", meaning: "second vector" },
      { symbol: "\\theta", meaning: "angle between vectors" },
    ],

    example:
      "Find cross product magnitude",
  },

  {
    id: 293,
    title: "Complex Number Modulus",
    subject: "Further Mathematics",
    category: "Complex Numbers",
    level: "University",

    formula:
      "|z| = \\sqrt{a^2+b^2}",

    explanation:
      "Finds modulus of complex number.",

    variables: [
      { symbol: "a", meaning: "real part" },
      { symbol: "b", meaning: "imaginary part" },
    ],

    example:
      "Find modulus of 3 + 4i",
  },

  {
    id: 294,
    title: "De Moivre's Theorem",
    subject: "Further Mathematics",
    category: "Complex Numbers",
    level: "University",

    formula:
      "(\\cos\\theta+i\\sin\\theta)^n = \\cos n\\theta+i\\sin n\\theta",

    explanation:
      "Used in powers of complex numbers.",

    variables: [
      { symbol: "\\theta", meaning: "angle" },
      { symbol: "n", meaning: "power" },
    ],

    example:
      "Expand complex number using theorem",
  },

  {
    id: 295,
    title: "Laplace Transform",
    subject: "Further Mathematics",
    category: "Transforms",
    level: "University",

    formula:
      "\\mathcal{L}\\{f(t)\\}=\\int_0^\\infty e^{-st}f(t)dt",

    explanation:
      "Transforms time-domain function to frequency domain.",

    variables: [
      { symbol: "f(t)", meaning: "time function" },
      { symbol: "s", meaning: "complex frequency" },
    ],

    example:
      "Find Laplace transform of t²",
  },

  {
    id: 296,
    title: "Inverse Laplace Transform",
    subject: "Further Mathematics",
    category: "Transforms",
    level: "University",

    formula:
      "\\mathcal{L}^{-1}\\{F(s)\\}=f(t)",

    explanation:
      "Converts frequency-domain function to time-domain.",

    variables: [
      { symbol: "F(s)", meaning: "frequency-domain function" },
    ],

    example:
      "Find inverse Laplace of 1/s²",
  },

  {
    id: 297,
    title: "Polar Form of Complex Number",
    subject: "Further Mathematics",
    category: "Complex Numbers",
    level: "University",

    formula:
      "z = r(\\cos\\theta + i\\sin\\theta)",

    explanation:
      "Expresses complex number in polar form.",

    variables: [
      { symbol: "r", meaning: "modulus" },
      { symbol: "\\theta", meaning: "argument" },
    ],

    example:
      "Convert 1+i into polar form",
  },

  {
    id: 298,
    title: "Parametric Equation",
    subject: "Further Mathematics",
    category: "Coordinate Geometry",
    level: "University",

    formula:
      "x = a\\cos t, \\quad y = a\\sin t",

    explanation:
      "Represents circle parametrically.",

    variables: [
      { symbol: "a", meaning: "radius" },
      { symbol: "t", meaning: "parameter" },
    ],

    example:
      "Sketch curve for parametric equation",
  },

  {
    id: 299,
    title: "Second Derivative Test",
    subject: "Further Mathematics",
    category: "Calculus",
    level: "University",

    formula:
      "\\frac{d^2y}{dx^2}",

    explanation:
      "Determines nature of stationary points.",

    variables: [
      { symbol: "y", meaning: "function" },
      { symbol: "x", meaning: "variable" },
    ],

    example:
      "Determine maxima or minima",
  },

  {
    id: 300,
    title: "Fourier Series",
    subject: "Further Mathematics",
    category: "Series",
    level: "University",

    formula:
      "f(x)=a_0+\\sum_{n=1}^{\\infty}(a_n\\cos nx+b_n\\sin nx)",

    explanation:
      "Represents periodic functions as trigonometric series.",

    variables: [
      { symbol: "a_n", meaning: "cosine coefficients" },
      { symbol: "b_n", meaning: "sine coefficients" },
      { symbol: "n", meaning: "term number" },
    ],

    example:
      "Expand periodic signal using Fourier series",
  },
  {
    id: 301,
    title: "nth Term of Arithmetic Progression",
    subject: "Mathematics",
    category: "Sequence and Series",
    level: "Foundational",
    formula: "T_n = a + (n-1)d",
    explanation: "Finds the nth term of an arithmetic progression (AP).",
    variables: [
      { symbol: "a", meaning: "first term" },
      { symbol: "d", meaning: "common difference" },
      { symbol: "n", meaning: "term position" },
    ],
    example: "Find the 10th term of AP with a=2, d=3",
  },
  {
    id: 302,
    title: "Sum of Arithmetic Progression",
    subject: "Mathematics",
    category: "Sequence and Series",
    level: "Foundational",
    formula: "S_n = \\frac{n}{2}\\left[2a + (n-1)d\\right]",
    explanation: "Calculates the sum of the first n terms of an AP.",
    variables: [
      { symbol: "S_n", meaning: "sum of n terms" },
      { symbol: "a", meaning: "first term" },
      { symbol: "d", meaning: "common difference" },
      { symbol: "n", meaning: "number of terms" },
    ],
    example: "Find sum of first 10 terms with a=2, d=3",
  },
  {
    id: 303,
    title: "nth Term of Geometric Progression",
    subject: "Mathematics",
    category: "Sequence and Series",
    level: "Foundational",
    formula: "T_n = ar^{n-1}",
    explanation: "Finds the nth term of a geometric progression (GP).",
    variables: [
      { symbol: "a", meaning: "first term" },
      { symbol: "r", meaning: "common ratio" },
      { symbol: "n", meaning: "term position" },
    ],
    example: "Find the 5th term of GP with a=3, r=2",
  },
  {
    id: 304,
    title: "Sum of Geometric Progression (Finite)",
    subject: "Mathematics",
    category: "Sequence and Series",
    level: "Foundational",
    formula: "S_n = \\frac{a(r^n - 1)}{r - 1}, \\quad r \\ne 1",
    explanation: "Calculates the sum of the first n terms of a GP.",
    variables: [
      { symbol: "a", meaning: "first term" },
      { symbol: "r", meaning: "common ratio" },
      { symbol: "n", meaning: "number of terms" },
    ],
    example: "Find sum of first 6 terms with a=3, r=2",
  },
  {
    id: 305,
    title: "Sum to Infinity of GP",
    subject: "Mathematics",
    category: "Sequence and Series",
    level: "University",
    formula: "S_\\infty = \\frac{a}{1-r}, \\quad |r| < 1",
    explanation: "Calculates the sum of an infinite geometric series.",
    variables: [
      { symbol: "a", meaning: "first term" },
      { symbol: "r", meaning: "common ratio" },
    ],
    example: "Find sum to infinity when a=4, r=0.5",
  },

  // =========================
  // MATHEMATICS — Trigonometry
  // =========================
  {
    id: 306,
    title: "Sine Rule",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "Foundational",
    formula: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}",
    explanation: "Relates the sides and angles of any triangle.",
    variables: [
      { symbol: "a,b,c", meaning: "sides opposite angles A,B,C" },
      { symbol: "A,B,C", meaning: "angles of the triangle" },
    ],
    example: "Find side b given a=8, A=40°, B=60°",
  },
  {
    id: 307,
    title: "Cosine Rule",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "Foundational",
    formula: "a^2 = b^2 + c^2 - 2bc\\cos A",
    explanation: "Finds a side or angle of a triangle when SAS or SSS is known.",
    variables: [
      { symbol: "a,b,c", meaning: "sides of triangle" },
      { symbol: "A", meaning: "angle opposite side a" },
    ],
    example: "Find a when b=7, c=9, A=60°",
  },
  {
    id: 308,
    title: "Area of Triangle (Trigonometric)",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "Foundational",
    formula: "A = \\frac{1}{2}ab\\sin C",
    explanation: "Finds the area of a triangle using two sides and the included angle.",
    variables: [
      { symbol: "a,b", meaning: "two sides of the triangle" },
      { symbol: "C", meaning: "included angle" },
    ],
    example: "Find area with a=5, b=7, C=45°",
  },
  {
    id: 309,
    title: "Sum to Product (Sine)",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "University",
    formula: "\\sin A + \\sin B = 2\\sin\\frac{A+B}{2}\\cos\\frac{A-B}{2}",
    explanation: "Converts sum of sines into a product.",
    variables: [
      { symbol: "A,B", meaning: "angles" },
    ],
    example: "Simplify sin60° + sin20°",
  },
  {
    id: 310,
    title: "Double Angle Formula (Sine)",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "Foundational",
    formula: "\\sin 2\\theta = 2\\sin\\theta\\cos\\theta",
    explanation: "Expresses sine of double angle in terms of single angle.",
    variables: [
      { symbol: "\\theta", meaning: "angle" },
    ],
    example: "Find sin60° using sin30° and cos30°",
  },
  {
    id: 311,
    title: "Double Angle Formula (Cosine)",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "Foundational",
    formula: "\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta",
    explanation: "Expresses cosine of double angle in terms of single angle.",
    variables: [
      { symbol: "\\theta", meaning: "angle" },
    ],
    example: "Find cos60° using cos30° and sin30°",
  },
  {
    id: 312,
    title: "Pythagorean Trig Identity",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "Foundational",
    formula: "\\sin^2\\theta + \\cos^2\\theta = 1",
    explanation: "Fundamental trigonometric identity relating sine and cosine.",
    variables: [
      { symbol: "\\theta", meaning: "angle" },
    ],
    example: "Find cosθ if sinθ = 0.6",
  },

  // =========================
  // MATHEMATICS — Mensuration
  // =========================
  {
    id: 313,
    title: "Surface Area of Sphere",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "A = 4\\pi r^2",
    explanation: "Calculates total surface area of a sphere.",
    variables: [
      { symbol: "r", meaning: "radius" },
    ],
    example: "Find surface area of a sphere with r=7cm",
  },
  {
    id: 314,
    title: "Volume of Sphere",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "V = \\frac{4}{3}\\pi r^3",
    explanation: "Calculates the volume of a sphere.",
    variables: [
      { symbol: "r", meaning: "radius" },
    ],
    example: "Find volume of a sphere with r=6cm",
  },
  {
    id: 315,
    title: "Volume of Cone",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "V = \\frac{1}{3}\\pi r^2 h",
    explanation: "Calculates the volume of a cone.",
    variables: [
      { symbol: "r", meaning: "base radius" },
      { symbol: "h", meaning: "height" },
    ],
    example: "Find volume of cone with r=3cm, h=9cm",
  },
  {
    id: 316,
    title: "Curved Surface Area of Cone",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "A = \\pi r l",
    explanation: "Calculates curved (lateral) surface area of a cone.",
    variables: [
      { symbol: "r", meaning: "base radius" },
      { symbol: "l", meaning: "slant height" },
    ],
    example: "Find CSA when r=5cm, l=13cm",
  },
  {
    id: 317,
    title: "Volume of Cuboid",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "V = lbh",
    explanation: "Calculates the volume of a cuboid.",
    variables: [
      { symbol: "l", meaning: "length" },
      { symbol: "b", meaning: "breadth" },
      { symbol: "h", meaning: "height" },
    ],
    example: "Find volume when l=5, b=3, h=4",
  },
  {
    id: 318,
    title: "Volume of Cube",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "V = a^3",
    explanation: "Calculates the volume of a cube.",
    variables: [
      { symbol: "a", meaning: "side length" },
    ],
    example: "Find volume of a cube with side 4cm",
  },
  {
    id: 319,
    title: "Total Surface Area of Cube",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "A = 6a^2",
    explanation: "Calculates total surface area of a cube.",
    variables: [
      { symbol: "a", meaning: "side length" },
    ],
    example: "Find TSA of cube with side 5cm",
  },
  {
    id: 320,
    title: "Volume of Frustum of a Cone",
    subject: "Mathematics",
    category: "Mensuration",
    level: "University",
    formula: "V = \\frac{1}{3}\\pi h (R^2 + Rr + r^2)",
    explanation: "Calculates the volume of a frustum (truncated cone).",
    variables: [
      { symbol: "R", meaning: "radius of larger base" },
      { symbol: "r", meaning: "radius of smaller base" },
      { symbol: "h", meaning: "height of frustum" },
    ],
    example: "Find volume of frustum with R=6, r=3, h=8",
  },
  {
    id: 321,
    title: "Area of a Sector",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "A = \\frac{\\theta}{360}\\pi r^2",
    explanation: "Calculates the area of a circular sector.",
    variables: [
      { symbol: "\\theta", meaning: "angle in degrees" },
      { symbol: "r", meaning: "radius" },
    ],
    example: "Find sector area when θ=60°, r=7cm",
  },
  {
    id: 322,
    title: "Length of an Arc",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "L = \\frac{\\theta}{360}\\times 2\\pi r",
    explanation: "Calculates the length of an arc of a circle.",
    variables: [
      { symbol: "\\theta", meaning: "angle in degrees" },
      { symbol: "r", meaning: "radius" },
    ],
    example: "Find arc length when θ=90°, r=14cm",
  },
  {
    id: 323,
    title: "Area of Trapezium",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "A = \\frac{1}{2}(a+b)h",
    explanation: "Calculates the area of a trapezium.",
    variables: [
      { symbol: "a,b", meaning: "parallel sides" },
      { symbol: "h", meaning: "height between the parallel sides" },
    ],
    example: "Find area with a=6, b=10, h=4",
  },
  {
    id: 324,
    title: "Area of Rhombus",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "A = \\frac{1}{2}d_1 d_2",
    explanation: "Calculates the area of a rhombus using its diagonals.",
    variables: [
      { symbol: "d_1,d_2", meaning: "lengths of the diagonals" },
    ],
    example: "Find area with diagonals 10cm and 8cm",
  },
  {
    id: 325,
    title: "Area of Parallelogram",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "A = bh",
    explanation: "Calculates the area of a parallelogram.",
    variables: [
      { symbol: "b", meaning: "base" },
      { symbol: "h", meaning: "perpendicular height" },
    ],
    example: "Find area with b=8cm, h=5cm",
  },

  // =========================
  // MATHEMATICS — Algebra & Logs
  // =========================
  {
    id: 326,
    title: "Sum and Product of Roots",
    subject: "Mathematics",
    category: "Algebra",
    level: "Foundational",
    formula: "\\alpha + \\beta = -\\frac{b}{a}, \\quad \\alpha\\beta = \\frac{c}{a}",
    explanation: "Relates the roots of a quadratic equation to its coefficients.",
    variables: [
      { symbol: "\\alpha,\\beta", meaning: "roots of the equation" },
      { symbol: "a,b,c", meaning: "coefficients of ax²+bx+c=0" },
    ],
    example: "Find sum and product of roots of 2x²-5x+3=0",
  },
  {
    id: 327,
    title: "Discriminant of a Quadratic",
    subject: "Mathematics",
    category: "Algebra",
    level: "Foundational",
    formula: "\\Delta = b^2 - 4ac",
    explanation: "Determines the nature of roots of a quadratic equation.",
    variables: [
      { symbol: "a,b,c", meaning: "coefficients of ax²+bx+c=0" },
    ],
    example: "Determine nature of roots of x²+2x+5=0",
  },
  {
    id: 328,
    title: "Change of Base Formula",
    subject: "Mathematics",
    category: "Logarithm",
    level: "Foundational",
    formula: "\\log_a b = \\frac{\\log_c b}{\\log_c a}",
    explanation: "Converts a logarithm from one base to another.",
    variables: [
      { symbol: "a", meaning: "original base" },
      { symbol: "c", meaning: "new base" },
      { symbol: "b", meaning: "argument" },
    ],
    example: "Evaluate log₂8 using base 10",
  },
  {
    id: 329,
    title: "Product Law of Logarithms",
    subject: "Mathematics",
    category: "Logarithm",
    level: "Foundational",
    formula: "\\log_a(xy) = \\log_a x + \\log_a y",
    explanation: "Splits the logarithm of a product into a sum of logarithms.",
    variables: [
      { symbol: "x,y", meaning: "positive real numbers" },
      { symbol: "a", meaning: "base" },
    ],
    example: "Simplify log₂(4×8)",
  },
  {
    id: 330,
    title: "Quotient Law of Logarithms",
    subject: "Mathematics",
    category: "Logarithm",
    level: "Foundational",
    formula: "\\log_a\\left(\\frac{x}{y}\\right) = \\log_a x - \\log_a y",
    explanation: "Splits the logarithm of a quotient into a difference of logarithms.",
    variables: [
      { symbol: "x,y", meaning: "positive real numbers" },
      { symbol: "a", meaning: "base" },
    ],
    example: "Simplify log₃(27/9)",
  },
  {
    id: 331,
    title: "Power Law of Logarithms",
    subject: "Mathematics",
    category: "Logarithm",
    level: "Foundational",
    formula: "\\log_a x^n = n\\log_a x",
    explanation: "Brings the exponent of the argument down as a multiplier.",
    variables: [
      { symbol: "x", meaning: "base value" },
      { symbol: "n", meaning: "exponent" },
    ],
    example: "Simplify log₂(8³)",
  },
  {
    id: 332,
    title: "Remainder Theorem",
    subject: "Mathematics",
    category: "Algebra",
    level: "Foundational",
    formula: "f(a) = \\text{remainder when } f(x) \\div (x-a)",
    explanation: "Finds the remainder of a polynomial division without long division.",
    variables: [
      { symbol: "f(x)", meaning: "polynomial function" },
      { symbol: "a", meaning: "value dividing (x - a)" },
    ],
    example: "Find remainder when x³-2x+1 is divided by (x-2)",
  },
  {
    id: 333,
    title: "Factor Theorem",
    subject: "Mathematics",
    category: "Algebra",
    level: "Foundational",
    formula: "(x-a) \\text{ is a factor of } f(x) \\iff f(a) = 0",
    explanation: "Tests whether (x - a) is a factor of a polynomial.",
    variables: [
      { symbol: "f(x)", meaning: "polynomial function" },
      { symbol: "a", meaning: "test value" },
    ],
    example: "Show (x-1) is a factor of x³-1",
  },

  // =========================
  // MATHEMATICS — Statistics & Probability
  // =========================
  {
    id: 334,
    title: "Mean of Grouped Data",
    subject: "Mathematics",
    category: "Statistics",
    level: "Foundational",
    formula: "\\bar{x} = \\frac{\\sum fx}{\\sum f}",
    explanation: "Calculates the mean of grouped frequency data.",
    variables: [
      { symbol: "f", meaning: "frequency" },
      { symbol: "x", meaning: "class midpoint" },
    ],
    example: "Find mean of a grouped frequency table",
  },
  {
    id: 335,
    title: "Standard Deviation (Ungrouped)",
    subject: "Mathematics",
    category: "Statistics",
    level: "University",
    formula: "\\sigma = \\sqrt{\\frac{\\sum(x-\\bar{x})^2}{n}}",
    explanation: "Measures the spread of a data set around its mean.",
    variables: [
      { symbol: "x", meaning: "data value" },
      { symbol: "\\bar{x}", meaning: "mean" },
      { symbol: "n", meaning: "number of data points" },
    ],
    example: "Find standard deviation of {2,4,6,8,10}",
  },
  {
    id: 336,
    title: "Variance",
    subject: "Mathematics",
    category: "Statistics",
    level: "University",
    formula: "\\text{Var}(X) = \\sigma^2",
    explanation: "The square of the standard deviation; measures data spread.",
    variables: [
      { symbol: "\\sigma", meaning: "standard deviation" },
    ],
    example: "Find variance given σ = 3",
  },
  {
    id: 337,
    title: "Range",
    subject: "Mathematics",
    category: "Statistics",
    level: "Foundational",
    formula: "\\text{Range} = x_{max} - x_{min}",
    explanation: "Measures the spread between the highest and lowest data values.",
    variables: [
      { symbol: "x_{max}", meaning: "highest value" },
      { symbol: "x_{min}", meaning: "lowest value" },
    ],
    example: "Find range of {3,7,9,15,2}",
  },
  {
    id: 338,
    title: "Permutation Formula",
    subject: "Mathematics",
    category: "Probability",
    level: "Foundational",
    formula: "^nP_r = \\frac{n!}{(n-r)!}",
    explanation: "Counts arrangements of r items chosen from n where order matters.",
    variables: [
      { symbol: "n", meaning: "total number of items" },
      { symbol: "r", meaning: "number of items chosen" },
    ],
    example: "Find ⁵P₂",
  },
  {
    id: 339,
    title: "Combination Formula",
    subject: "Mathematics",
    category: "Probability",
    level: "Foundational",
    formula: "^nC_r = \\frac{n!}{r!(n-r)!}",
    explanation: "Counts selections of r items from n where order doesn't matter.",
    variables: [
      { symbol: "n", meaning: "total number of items" },
      { symbol: "r", meaning: "number of items chosen" },
    ],
    example: "Find ⁶C₂",
  },
  {
    id: 340,
    title: "Addition Rule of Probability",
    subject: "Mathematics",
    category: "Probability",
    level: "Foundational",
    formula: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)",
    explanation: "Finds the probability that event A or B occurs.",
    variables: [
      { symbol: "P(A)", meaning: "probability of A" },
      { symbol: "P(B)", meaning: "probability of B" },
      { symbol: "P(A \\cap B)", meaning: "probability of both A and B" },
    ],
    example: "Find P(A∪B) given P(A)=0.4, P(B)=0.5, P(A∩B)=0.2",
  },
  {
    id: 341,
    title: "Multiplication Rule (Independent Events)",
    subject: "Mathematics",
    category: "Probability",
    level: "Foundational",
    formula: "P(A \\cap B) = P(A) \\times P(B)",
    explanation: "Finds the probability that two independent events both occur.",
    variables: [
      { symbol: "P(A), P(B)", meaning: "probabilities of independent events" },
    ],
    example: "Find P(A∩B) given P(A)=0.3, P(B)=0.6",
  },
  {
    id: 342,
    title: "Conditional Probability",
    subject: "Mathematics",
    category: "Probability",
    level: "University",
    formula: "P(A|B) = \\frac{P(A \\cap B)}{P(B)}",
    explanation: "Finds the probability of A occurring given that B has occurred.",
    variables: [
      { symbol: "P(A \\cap B)", meaning: "probability of both A and B" },
      { symbol: "P(B)", meaning: "probability of B" },
    ],
    example: "Find P(A|B) given P(A∩B)=0.2, P(B)=0.5",
  },

  // =========================
  // MATHEMATICS — Coordinate Geometry & Vectors
  // =========================
  {
    id: 343,
    title: "Midpoint Formula",
    subject: "Mathematics",
    category: "Coordinate Geometry",
    level: "Foundational",
    formula: "M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)",
    explanation: "Finds the midpoint between two coordinate points.",
    variables: [
      { symbol: "x_1,y_1", meaning: "first point" },
      { symbol: "x_2,y_2", meaning: "second point" },
    ],
    example: "Find midpoint of (2,3) and (6,7)",
  },
  {
    id: 344,
    title: "Equation of a Straight Line",
    subject: "Mathematics",
    category: "Coordinate Geometry",
    level: "Foundational",
    formula: "y - y_1 = m(x - x_1)",
    explanation: "Gives the equation of a line through a point with a known slope.",
    variables: [
      { symbol: "m", meaning: "slope" },
      { symbol: "x_1,y_1", meaning: "known point on the line" },
    ],
    example: "Find equation of line through (2,3) with slope 4",
  },
  {
    id: 345,
    title: "Condition for Parallel Lines",
    subject: "Mathematics",
    category: "Coordinate Geometry",
    level: "Foundational",
    formula: "m_1 = m_2",
    explanation: "Two lines are parallel when their slopes are equal.",
    variables: [
      { symbol: "m_1,m_2", meaning: "slopes of the two lines" },
    ],
    example: "Check if y=2x+1 is parallel to y=2x-5",
  },
  {
    id: 346,
    title: "Condition for Perpendicular Lines",
    subject: "Mathematics",
    category: "Coordinate Geometry",
    level: "Foundational",
    formula: "m_1 \\times m_2 = -1",
    explanation: "Two lines are perpendicular when the product of their slopes is -1.",
    variables: [
      { symbol: "m_1,m_2", meaning: "slopes of the two lines" },
    ],
    example: "Check if y=2x+1 is perpendicular to y=-0.5x+3",
  },
  {
    id: 347,
    title: "Unit Vector Formula",
    subject: "Mathematics",
    category: "Vectors",
    level: "University",
    formula: "\\hat{a} = \\frac{\\vec{a}}{|\\vec{a}|}",
    explanation: "Converts a vector into a vector of magnitude 1 in the same direction.",
    variables: [
      { symbol: "\\vec{a}", meaning: "original vector" },
      { symbol: "|\\vec{a}|", meaning: "magnitude of the vector" },
    ],
    example: "Find unit vector of (3,4)",
  },

  // =========================
  // MATHEMATICS — Sets
  // =========================
  {
    id: 348,
    title: "Cardinality of Union of Two Sets",
    subject: "Mathematics",
    category: "Sets",
    level: "Foundational",
    formula: "n(A \\cup B) = n(A) + n(B) - n(A \\cap B)",
    explanation: "Finds the number of elements in the union of two sets.",
    variables: [
      { symbol: "n(A), n(B)", meaning: "number of elements in each set" },
      { symbol: "n(A \\cap B)", meaning: "elements common to both sets" },
    ],
    example: "Find n(A∪B) given n(A)=20, n(B)=15, n(A∩B)=5",
  },
  {
    id: 349,
    title: "De Morgan's Law (Union)",
    subject: "Mathematics",
    category: "Sets",
    level: "University",
    formula: "(A \\cup B)' = A' \\cap B'",
    explanation: "The complement of a union equals the intersection of complements.",
    variables: [
      { symbol: "A,B", meaning: "sets" },
    ],
    example: "Simplify (A∪B)' for two sets",
  },
  {
    id: 350,
    title: "De Morgan's Law (Intersection)",
    subject: "Mathematics",
    category: "Sets",
    level: "University",
    formula: "(A \\cap B)' = A' \\cup B'",
    explanation: "The complement of an intersection equals the union of complements.",
    variables: [
      { symbol: "A,B", meaning: "sets" },
    ],
    example: "Simplify (A∩B)' for two sets",
  },

  // =========================
  // FURTHER MATHEMATICS
  // =========================
  {
    id: 351,
    title: "Partial Fractions (Distinct Linear Factors)",
    subject: "Further Mathematics",
    category: "Algebra",
    level: "University",
    formula: "\\frac{f(x)}{(x-a)(x-b)} = \\frac{A}{x-a} + \\frac{B}{x-b}",
    explanation: "Decomposes a rational function into simpler fractions.",
    variables: [
      { symbol: "A,B", meaning: "constants to be determined" },
      { symbol: "a,b", meaning: "roots of the denominator" },
    ],
    example: "Decompose (3x+1)/((x-1)(x+2))",
  },
  {
    id: 352,
    title: "Newton-Raphson Method",
    subject: "Further Mathematics",
    category: "Numerical Methods",
    level: "University",
    formula: "x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}",
    explanation: "Iteratively approximates the roots of a function.",
    variables: [
      { symbol: "x_n", meaning: "current approximation" },
      { symbol: "f'(x_n)", meaning: "derivative at x_n" },
    ],
    example: "Approximate root of x³-2=0 starting at x=1.5",
  },
  {
    id: 353,
    title: "Trapezoidal Rule",
    subject: "Further Mathematics",
    category: "Numerical Methods",
    level: "University",
    formula: "\\int_a^b f(x)dx \\approx \\frac{h}{2}\\left[f(x_0)+2\\sum f(x_i)+f(x_n)\\right]",
    explanation: "Approximates the definite integral using trapezoids.",
    variables: [
      { symbol: "h", meaning: "strip width" },
      { symbol: "f(x_i)", meaning: "function values at intermediate points" },
    ],
    example: "Estimate ∫x²dx from 0 to 2 using 4 strips",
  },
  {
    id: 354,
    title: "Equation of a Parabola",
    subject: "Further Mathematics",
    category: "Conics",
    level: "University",
    formula: "y^2 = 4ax",
    explanation: "Standard equation of a parabola with vertex at the origin.",
    variables: [
      { symbol: "a", meaning: "distance from vertex to focus" },
    ],
    example: "Find focus of y²=8x",
  },
  {
    id: 355,
    title: "Equation of an Ellipse",
    subject: "Further Mathematics",
    category: "Conics",
    level: "University",
    formula: "\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1",
    explanation: "Standard equation of an ellipse centered at the origin.",
    variables: [
      { symbol: "a", meaning: "semi-major axis" },
      { symbol: "b", meaning: "semi-minor axis" },
    ],
    example: "Find foci of ellipse x²/25+y²/9=1",
  },
  {
    id: 356,
    title: "Equation of a Hyperbola",
    subject: "Further Mathematics",
    category: "Conics",
    level: "University",
    formula: "\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1",
    explanation: "Standard equation of a hyperbola centered at the origin.",
    variables: [
      { symbol: "a,b", meaning: "semi-axes of the hyperbola" },
    ],
    example: "Find asymptotes of x²/16-y²/9=1",
  },
  {
    id: 357,
    title: "Modulus-Argument Multiplication",
    subject: "Further Mathematics",
    category: "Complex Numbers",
    level: "University",
    formula: "z_1 z_2 = r_1 r_2\\left[\\cos(\\theta_1+\\theta_2)+i\\sin(\\theta_1+\\theta_2)\\right]",
    explanation: "Multiplies two complex numbers in polar form.",
    variables: [
      { symbol: "r_1,r_2", meaning: "moduli" },
      { symbol: "\\theta_1,\\theta_2", meaning: "arguments" },
    ],
    example: "Multiply 2(cos30°+isin30°) by 3(cos60°+isin60°)",
  },
  {
    id: 358,
    title: "Poisson Distribution",
    subject: "Further Mathematics",
    category: "Probability Distribution",
    level: "University",
    formula: "P(X=x) = \\frac{e^{-\\lambda}\\lambda^x}{x!}",
    explanation: "Models the probability of a given number of events in a fixed interval.",
    variables: [
      { symbol: "\\lambda", meaning: "average rate of occurrence" },
      { symbol: "x", meaning: "number of occurrences" },
    ],
    example: "Find P(X=3) when λ=2",
  },
  {
    id: 359,
    title: "Binomial Distribution",
    subject: "Further Mathematics",
    category: "Probability Distribution",
    level: "University",
    formula: "P(X=x) = {}^nC_x p^x (1-p)^{n-x}",
    explanation: "Models the probability of x successes in n independent trials.",
    variables: [
      { symbol: "n", meaning: "number of trials" },
      { symbol: "p", meaning: "probability of success" },
      { symbol: "x", meaning: "number of successes" },
    ],
    example: "Find P(X=2) for n=5, p=0.5",
  },
  {
    id: 360,
    title: "Normal Distribution Z-Score",
    subject: "Further Mathematics",
    category: "Probability Distribution",
    level: "University",
    formula: "z = \\frac{x - \\mu}{\\sigma}",
    explanation: "Standardizes a value to determine its position on a normal distribution.",
    variables: [
      { symbol: "x", meaning: "data value" },
      { symbol: "\\mu", meaning: "mean" },
      { symbol: "\\sigma", meaning: "standard deviation" },
    ],
    example: "Find z-score for x=70, μ=60, σ=5",
  },

  // =========================
  // PHYSICS — Optics
  // =========================
  {
    id: 361,
    title: "Snell's Law",
    subject: "Physics",
    category: "Optics",
    level: "Foundational",
    formula: "n_1\\sin\\theta_1 = n_2\\sin\\theta_2",
    explanation: "Relates angles of incidence and refraction at a boundary.",
    variables: [
      { symbol: "n_1,n_2", meaning: "refractive indices of the two media" },
      { symbol: "\\theta_1,\\theta_2", meaning: "angles of incidence and refraction" },
    ],
    example: "Find angle of refraction as light passes from air to glass",
  },
  {
    id: 362,
    title: "Lens Formula",
    subject: "Physics",
    category: "Optics",
    level: "Foundational",
    formula: "\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}",
    explanation: "Relates object distance, image distance, and focal length of a lens.",
    variables: [
      { symbol: "f", meaning: "focal length" },
      { symbol: "v", meaning: "image distance" },
      { symbol: "u", meaning: "object distance" },
    ],
    example: "Find image distance for f=10cm, u=15cm",
  },
  {
    id: 363,
    title: "Mirror Formula",
    subject: "Physics",
    category: "Optics",
    level: "Foundational",
    formula: "\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}",
    explanation: "Relates object distance, image distance, and focal length of a mirror.",
    variables: [
      { symbol: "f", meaning: "focal length" },
      { symbol: "v", meaning: "image distance" },
      { symbol: "u", meaning: "object distance" },
    ],
    example: "Find image distance for a concave mirror",
  },
  {
    id: 364,
    title: "Linear Magnification",
    subject: "Physics",
    category: "Optics",
    level: "Foundational",
    formula: "m = \\frac{v}{u} = \\frac{h_i}{h_o}",
    explanation: "Compares image size to object size for a lens or mirror.",
    variables: [
      { symbol: "v,u", meaning: "image and object distances" },
      { symbol: "h_i,h_o", meaning: "image and object heights" },
    ],
    example: "Find magnification when v=20cm, u=10cm",
  },
  {
    id: 365,
    title: "Critical Angle",
    subject: "Physics",
    category: "Optics",
    level: "Foundational",
    formula: "\\sin C = \\frac{1}{n}",
    explanation: "Finds the angle beyond which total internal reflection occurs.",
    variables: [
      { symbol: "C", meaning: "critical angle" },
      { symbol: "n", meaning: "refractive index of the denser medium" },
    ],
    example: "Find critical angle for glass with n=1.5",
  },
  {
    id: 366,
    title: "Power of a Lens",
    subject: "Physics",
    category: "Optics",
    level: "Foundational",
    formula: "P = \\frac{1}{f}",
    explanation: "Calculates the power of a lens in dioptres.",
    variables: [
      { symbol: "f", meaning: "focal length in metres" },
    ],
    example: "Find power of a lens with f=0.5m",
  },

  // =========================
  // PHYSICS — Mechanics & Motion
  // =========================
  {
    id: 367,
    title: "First Equation of Motion",
    subject: "Physics",
    category: "Motion",
    level: "Foundational",
    formula: "v = u + at",
    explanation: "Relates final velocity to initial velocity, acceleration, and time.",
    variables: [
      { symbol: "v", meaning: "final velocity" },
      { symbol: "u", meaning: "initial velocity" },
      { symbol: "a", meaning: "acceleration" },
      { symbol: "t", meaning: "time" },
    ],
    example: "Find final velocity for u=5m/s, a=2m/s², t=4s",
  },
  {
    id: 368,
    title: "Second Equation of Motion",
    subject: "Physics",
    category: "Motion",
    level: "Foundational",
    formula: "s = ut + \\frac{1}{2}at^2",
    explanation: "Calculates displacement given initial velocity, acceleration, and time.",
    variables: [
      { symbol: "s", meaning: "displacement" },
      { symbol: "u", meaning: "initial velocity" },
      { symbol: "a", meaning: "acceleration" },
      { symbol: "t", meaning: "time" },
    ],
    example: "Find displacement for u=0, a=3m/s², t=5s",
  },
  {
    id: 369,
    title: "Third Equation of Motion",
    subject: "Physics",
    category: "Motion",
    level: "Foundational",
    formula: "v^2 = u^2 + 2as",
    explanation: "Relates velocity, acceleration, and displacement without time.",
    variables: [
      { symbol: "v", meaning: "final velocity" },
      { symbol: "u", meaning: "initial velocity" },
      { symbol: "a", meaning: "acceleration" },
      { symbol: "s", meaning: "displacement" },
    ],
    example: "Find final velocity for u=2m/s, a=4m/s², s=10m",
  },
  {
    id: 370,
    title: "Range of a Projectile",
    subject: "Physics",
    category: "Projectile Motion",
    level: "University",
    formula: "R = \\frac{u^2\\sin 2\\theta}{g}",
    explanation: "Calculates the horizontal range of a projectile.",
    variables: [
      { symbol: "u", meaning: "initial velocity" },
      { symbol: "\\theta", meaning: "angle of projection" },
      { symbol: "g", meaning: "acceleration due to gravity" },
    ],
    example: "Find range when u=20m/s, θ=45°",
  },
  {
    id: 371,
    title: "Maximum Height of a Projectile",
    subject: "Physics",
    category: "Projectile Motion",
    level: "University",
    formula: "H = \\frac{u^2\\sin^2\\theta}{2g}",
    explanation: "Calculates the maximum height reached by a projectile.",
    variables: [
      { symbol: "u", meaning: "initial velocity" },
      { symbol: "\\theta", meaning: "angle of projection" },
      { symbol: "g", meaning: "acceleration due to gravity" },
    ],
    example: "Find max height when u=30m/s, θ=30°",
  },
  {
    id: 372,
    title: "Time of Flight of a Projectile",
    subject: "Physics",
    category: "Projectile Motion",
    level: "University",
    formula: "T = \\frac{2u\\sin\\theta}{g}",
    explanation: "Calculates total time a projectile stays in the air.",
    variables: [
      { symbol: "u", meaning: "initial velocity" },
      { symbol: "\\theta", meaning: "angle of projection" },
      { symbol: "g", meaning: "acceleration due to gravity" },
    ],
    example: "Find time of flight when u=25m/s, θ=60°",
  },
  {
    id: 373,
    title: "Torque",
    subject: "Physics",
    category: "Rotational Mechanics",
    level: "Foundational",
    formula: "\\tau = Fr\\sin\\theta",
    explanation: "Measures the turning effect of a force about a pivot.",
    variables: [
      { symbol: "F", meaning: "applied force" },
      { symbol: "r", meaning: "distance from pivot" },
      { symbol: "\\theta", meaning: "angle between force and lever arm" },
    ],
    example: "Find torque for F=10N, r=0.5m, θ=90°",
  },
  {
    id: 374,
    title: "Moment of Inertia (Point Mass)",
    subject: "Physics",
    category: "Rotational Mechanics",
    level: "University",
    formula: "I = mr^2",
    explanation: "Measures resistance of a point mass to rotational motion.",
    variables: [
      { symbol: "m", meaning: "mass" },
      { symbol: "r", meaning: "distance from axis of rotation" },
    ],
    example: "Find I for m=2kg at r=0.3m",
  },
  {
    id: 375,
    title: "Angular Velocity",
    subject: "Physics",
    category: "Circular Motion",
    level: "Foundational",
    formula: "\\omega = \\frac{\\theta}{t}",
    explanation: "Calculates the rate of change of angular displacement.",
    variables: [
      { symbol: "\\theta", meaning: "angular displacement" },
      { symbol: "t", meaning: "time" },
    ],
    example: "Find ω for θ=6rad, t=2s",
  },
  {
    id: 376,
    title: "Centripetal Acceleration",
    subject: "Physics",
    category: "Circular Motion",
    level: "Foundational",
    formula: "a_c = \\frac{v^2}{r}",
    explanation: "Calculates the acceleration directed toward the center of a circular path.",
    variables: [
      { symbol: "v", meaning: "linear velocity" },
      { symbol: "r", meaning: "radius of the circular path" },
    ],
    example: "Find centripetal acceleration for v=10m/s, r=2m",
  },
  {
    id: 377,
    title: "Work Done by a Force",
    subject: "Physics",
    category: "Energy",
    level: "Foundational",
    formula: "W = Fd\\cos\\theta",
    explanation: "Calculates the work done by a force over a displacement.",
    variables: [
      { symbol: "F", meaning: "applied force" },
      { symbol: "d", meaning: "displacement" },
      { symbol: "\\theta", meaning: "angle between force and displacement" },
    ],
    example: "Find work when F=20N, d=5m, θ=0°",
  },
  {
    id: 378,
    title: "Power (Mechanical)",
    subject: "Physics",
    category: "Energy",
    level: "Foundational",
    formula: "P = \\frac{W}{t}",
    explanation: "Calculates the rate at which work is done.",
    variables: [
      { symbol: "W", meaning: "work done" },
      { symbol: "t", meaning: "time taken" },
    ],
    example: "Find power when W=500J, t=10s",
  },
  {
    id: 379,
    title: "Efficiency of a Machine",
    subject: "Physics",
    category: "Machines",
    level: "Foundational",
    formula: "\\eta = \\frac{\\text{Output Energy}}{\\text{Input Energy}}\\times 100\\%",
    explanation: "Measures how effectively a machine converts input energy to useful output.",
    variables: [
      { symbol: "\\eta", meaning: "efficiency (%)" },
    ],
    example: "Find efficiency when output=300J, input=500J",
  },
  {
    id: 380,
    title: "Young's Modulus",
    subject: "Physics",
    category: "Elasticity",
    level: "University",
    formula: "E = \\frac{\\text{Stress}}{\\text{Strain}}",
    explanation: "Measures the stiffness of a solid material.",
    variables: [
      { symbol: "E", meaning: "Young's modulus" },
    ],
    example: "Find E for a wire under given stress and strain",
  },
  {
    id: 381,
    title: "Hooke's Law",
    subject: "Physics",
    category: "Elasticity",
    level: "Foundational",
    formula: "F = ke",
    explanation: "Relates the force applied to a spring and its extension.",
    variables: [
      { symbol: "F", meaning: "applied force" },
      { symbol: "k", meaning: "spring constant" },
      { symbol: "e", meaning: "extension" },
    ],
    example: "Find force for k=200N/m, e=0.05m",
  },

  // =========================
  // PHYSICS — Heat & Gas Laws
  // =========================
  {
    id: 382,
    title: "Boyle's Law",
    subject: "Physics",
    category: "Gas Laws",
    level: "Foundational",
    formula: "P_1V_1 = P_2V_2",
    explanation: "Relates pressure and volume of a gas at constant temperature.",
    variables: [
      { symbol: "P_1,V_1", meaning: "initial pressure and volume" },
      { symbol: "P_2,V_2", meaning: "final pressure and volume" },
    ],
    example: "Find P2 when P1=100kPa, V1=2L, V2=1L",
  },
  {
    id: 383,
    title: "Charles's Law",
    subject: "Physics",
    category: "Gas Laws",
    level: "Foundational",
    formula: "\\frac{V_1}{T_1} = \\frac{V_2}{T_2}",
    explanation: "Relates volume and temperature of a gas at constant pressure.",
    variables: [
      { symbol: "V_1,T_1", meaning: "initial volume and temperature" },
      { symbol: "V_2,T_2", meaning: "final volume and temperature" },
    ],
    example: "Find V2 when V1=2L, T1=300K, T2=350K",
  },
  {
    id: 384,
    title: "Gay-Lussac's Law",
    subject: "Physics",
    category: "Gas Laws",
    level: "Foundational",
    formula: "\\frac{P_1}{T_1} = \\frac{P_2}{T_2}",
    explanation: "Relates pressure and temperature of a gas at constant volume.",
    variables: [
      { symbol: "P_1,T_1", meaning: "initial pressure and temperature" },
      { symbol: "P_2,T_2", meaning: "final pressure and temperature" },
    ],
    example: "Find P2 when P1=100kPa, T1=300K, T2=350K",
  },
  {
    id: 385,
    title: "General/Ideal Gas Equation",
    subject: "Physics",
    category: "Gas Laws",
    level: "University",
    formula: "PV = nRT",
    explanation: "Combines pressure, volume, amount, and temperature of an ideal gas.",
    variables: [
      { symbol: "P", meaning: "pressure" },
      { symbol: "V", meaning: "volume" },
      { symbol: "n", meaning: "number of moles" },
      { symbol: "R", meaning: "gas constant" },
      { symbol: "T", meaning: "temperature (K)" },
    ],
    example: "Find P for n=2mol, V=10L, T=300K",
  },
  {
    id: 386,
    title: "Specific Heat Capacity",
    subject: "Physics",
    category: "Heat",
    level: "Foundational",
    formula: "Q = mc\\Delta\\theta",
    explanation: "Calculates heat required to change the temperature of a substance.",
    variables: [
      { symbol: "Q", meaning: "heat energy" },
      { symbol: "m", meaning: "mass" },
      { symbol: "c", meaning: "specific heat capacity" },
      { symbol: "\\Delta\\theta", meaning: "temperature change" },
    ],
    example: "Find Q for m=2kg, c=4200J/kgK, Δθ=10K",
  },
  {
    id: 387,
    title: "Specific Latent Heat",
    subject: "Physics",
    category: "Heat",
    level: "Foundational",
    formula: "Q = mL",
    explanation: "Calculates heat needed for a phase change without temperature change.",
    variables: [
      { symbol: "Q", meaning: "heat energy" },
      { symbol: "m", meaning: "mass" },
      { symbol: "L", meaning: "specific latent heat" },
    ],
    example: "Find Q to melt 0.5kg of ice",
  },

  // =========================
  // PHYSICS — Electricity & Magnetism
  // =========================
  {
    id: 388,
    title: "Coulomb's Law",
    subject: "Physics",
    category: "Electrostatics",
    level: "University",
    formula: "F = \\frac{kq_1q_2}{r^2}",
    explanation: "Calculates the electrostatic force between two point charges.",
    variables: [
      { symbol: "k", meaning: "Coulomb's constant" },
      { symbol: "q_1,q_2", meaning: "magnitude of charges" },
      { symbol: "r", meaning: "distance between charges" },
    ],
    example: "Find force between two 2μC charges 0.1m apart",
  },
  {
    id: 389,
    title: "Capacitance",
    subject: "Physics",
    category: "Electricity",
    level: "University",
    formula: "C = \\frac{Q}{V}",
    explanation: "Relates charge stored to voltage across a capacitor.",
    variables: [
      { symbol: "C", meaning: "capacitance" },
      { symbol: "Q", meaning: "charge stored" },
      { symbol: "V", meaning: "voltage" },
    ],
    example: "Find C for Q=6μC, V=12V",
  },
  {
    id: 390,
    title: "Energy Stored in a Capacitor",
    subject: "Physics",
    category: "Electricity",
    level: "University",
    formula: "E = \\frac{1}{2}CV^2",
    explanation: "Calculates energy stored in a charged capacitor.",
    variables: [
      { symbol: "C", meaning: "capacitance" },
      { symbol: "V", meaning: "voltage" },
    ],
    example: "Find energy for C=100μF, V=10V",
  },
  {
    id: 391,
    title: "Resistors in Series",
    subject: "Physics",
    category: "Electricity",
    level: "Foundational",
    formula: "R_T = R_1 + R_2 + R_3",
    explanation: "Calculates total resistance of resistors connected in series.",
    variables: [
      { symbol: "R_1,R_2,R_3", meaning: "individual resistances" },
    ],
    example: "Find total resistance for R1=2Ω, R2=3Ω, R3=5Ω",
  },
  {
    id: 392,
    title: "Resistors in Parallel",
    subject: "Physics",
    category: "Electricity",
    level: "Foundational",
    formula: "\\frac{1}{R_T} = \\frac{1}{R_1} + \\frac{1}{R_2}",
    explanation: "Calculates total resistance of resistors connected in parallel.",
    variables: [
      { symbol: "R_1,R_2", meaning: "individual resistances" },
    ],
    example: "Find total resistance for R1=4Ω, R2=6Ω",
  },
  {
    id: 393,
    title: "Electrical Power",
    subject: "Physics",
    category: "Electricity",
    level: "Foundational",
    formula: "P = VI",
    explanation: "Calculates electrical power from voltage and current.",
    variables: [
      { symbol: "P", meaning: "power" },
      { symbol: "V", meaning: "voltage" },
      { symbol: "I", meaning: "current" },
    ],
    example: "Find power for V=220V, I=2A",
  },
  {
    id: 394,
    title: "Electrical Energy",
    subject: "Physics",
    category: "Electricity",
    level: "Foundational",
    formula: "E = Pt",
    explanation: "Calculates electrical energy consumed over time.",
    variables: [
      { symbol: "P", meaning: "power" },
      { symbol: "t", meaning: "time" },
    ],
    example: "Find energy for P=100W over 5 hours",
  },
  {
    id: 395,
    title: "Faraday's Law of Electromagnetic Induction",
    subject: "Physics",
    category: "Electromagnetic Induction",
    level: "University",
    formula: "\\varepsilon = -N\\frac{d\\Phi}{dt}",
    explanation: "Calculates the induced EMF from a changing magnetic flux.",
    variables: [
      { symbol: "\\varepsilon", meaning: "induced EMF" },
      { symbol: "N", meaning: "number of turns" },
      { symbol: "\\Phi", meaning: "magnetic flux" },
    ],
    example: "Find EMF induced in a coil with changing flux",
  },
  {
    id: 396,
    title: "Transformer Equation",
    subject: "Physics",
    category: "Electromagnetic Induction",
    level: "University",
    formula: "\\frac{V_p}{V_s} = \\frac{N_p}{N_s}",
    explanation: "Relates primary and secondary voltage to coil turns in a transformer.",
    variables: [
      { symbol: "V_p,V_s", meaning: "primary and secondary voltage" },
      { symbol: "N_p,N_s", meaning: "primary and secondary turns" },
    ],
    example: "Find Vs when Vp=240V, Np=100, Ns=25",
  },

  // =========================
  // PHYSICS — Waves & Modern Physics
  // =========================
  {
    id: 397,
    title: "Wave Equation",
    subject: "Physics",
    category: "Waves",
    level: "Foundational",
    formula: "v = f\\lambda",
    explanation: "Relates wave speed to its frequency and wavelength.",
    variables: [
      { symbol: "v", meaning: "wave speed" },
      { symbol: "f", meaning: "frequency" },
      { symbol: "\\lambda", meaning: "wavelength" },
    ],
    example: "Find speed when f=50Hz, λ=2m",
  },
  {
    id: 398,
    title: "Period of a Wave",
    subject: "Physics",
    category: "Waves",
    level: "Foundational",
    formula: "T = \\frac{1}{f}",
    explanation: "Relates the period of a wave to its frequency.",
    variables: [
      { symbol: "T", meaning: "period" },
      { symbol: "f", meaning: "frequency" },
    ],
    example: "Find period when f=20Hz",
  },
  {
    id: 399,
    title: "Doppler Effect (Approaching Source)",
    subject: "Physics",
    category: "Waves",
    level: "University",
    formula: "f_o = f_s\\left(\\frac{v}{v-v_s}\\right)",
    explanation: "Calculates observed frequency when a source moves toward an observer.",
    variables: [
      { symbol: "f_o", meaning: "observed frequency" },
      { symbol: "f_s", meaning: "source frequency" },
      { symbol: "v", meaning: "speed of sound" },
      { symbol: "v_s", meaning: "speed of source" },
    ],
    example: "Find observed frequency of an approaching ambulance siren",
  },
  {
    id: 400,
    title: "Einstein's Mass-Energy Equivalence",
    subject: "Physics",
    category: "Modern Physics",
    level: "University",
    formula: "E = mc^2",
    explanation: "Relates mass and energy through the speed of light.",
    variables: [
      { symbol: "E", meaning: "energy" },
      { symbol: "m", meaning: "mass" },
      { symbol: "c", meaning: "speed of light" },
    ],
    example: "Find energy equivalent of 1g of mass",
  },
  {
    id: 401,
    title: "Photoelectric Equation",
    subject: "Physics",
    category: "Modern Physics",
    level: "University",
    formula: "E_k = hf - \\phi",
    explanation: "Calculates the maximum kinetic energy of an emitted photoelectron.",
    variables: [
      { symbol: "h", meaning: "Planck's constant" },
      { symbol: "f", meaning: "frequency of incident light" },
      { symbol: "\\phi", meaning: "work function" },
    ],
    example: "Find Ek for a metal with φ=2eV under light of f=1×10^15Hz",
  },
  {
    id: 402,
    title: "De Broglie Wavelength",
    subject: "Physics",
    category: "Modern Physics",
    level: "University",
    formula: "\\lambda = \\frac{h}{p}",
    explanation: "Calculates the wavelength associated with a moving particle.",
    variables: [
      { symbol: "h", meaning: "Planck's constant" },
      { symbol: "p", meaning: "momentum of the particle" },
    ],
    example: "Find wavelength of an electron with given momentum",
  },
  {
    id: 403,
    title: "Radioactive Decay Law",
    subject: "Physics",
    category: "Modern Physics",
    level: "University",
    formula: "N = N_0 e^{-\\lambda t}",
    explanation: "Calculates the number of undecayed nuclei remaining after time t.",
    variables: [
      { symbol: "N_0", meaning: "initial number of nuclei" },
      { symbol: "\\lambda", meaning: "decay constant" },
      { symbol: "t", meaning: "time elapsed" },
    ],
    example: "Find remaining nuclei after 3 half-lives",
  },
  {
    id: 404,
    title: "Half-Life Relation",
    subject: "Physics",
    category: "Modern Physics",
    level: "University",
    formula: "t_{1/2} = \\frac{\\ln 2}{\\lambda}",
    explanation: "Relates the half-life of a radioactive substance to its decay constant.",
    variables: [
      { symbol: "t_{1/2}", meaning: "half-life" },
      { symbol: "\\lambda", meaning: "decay constant" },
    ],
    example: "Find half-life for λ = 0.05 per year",
  },

  // =========================
  // PHYSICS — Fluids
  // =========================
  {
    id: 405,
    title: "Archimedes' Principle",
    subject: "Physics",
    category: "Fluid Mechanics",
    level: "Foundational",
    formula: "F_b = \\rho V g",
    explanation: "Calculates the upthrust on a body submerged in a fluid.",
    variables: [
      { symbol: "\\rho", meaning: "density of fluid" },
      { symbol: "V", meaning: "volume of fluid displaced" },
      { symbol: "g", meaning: "acceleration due to gravity" },
    ],
    example: "Find upthrust on an object displacing 0.002m³ of water",
  },
  {
    id: 406,
    title: "Bernoulli's Equation",
    subject: "Physics",
    category: "Fluid Mechanics",
    level: "University",
    formula: "P + \\frac{1}{2}\\rho v^2 + \\rho gh = \\text{constant}",
    explanation: "Describes conservation of energy in a flowing fluid.",
    variables: [
      { symbol: "P", meaning: "pressure" },
      { symbol: "\\rho", meaning: "fluid density" },
      { symbol: "v", meaning: "fluid velocity" },
      { symbol: "h", meaning: "height" },
    ],
    example: "Compare pressure at two points in a pipe of varying width",
  },
  {
    id: 407,
    title: "Density Formula",
    subject: "Physics",
    category: "Matter",
    level: "Foundational",
    formula: "\\rho = \\frac{m}{V}",
    explanation: "Calculates density as mass per unit volume.",
    variables: [
      { symbol: "m", meaning: "mass" },
      { symbol: "V", meaning: "volume" },
    ],
    example: "Find density for m=500g, V=100cm³",
  },
  {
    id: 408,
    title: "Terminal Velocity (Stokes' Law)",
    subject: "Physics",
    category: "Fluid Mechanics",
    level: "University",
    formula: "v_t = \\frac{2r^2(\\rho_s-\\rho_f)g}{9\\eta}",
    explanation: "Calculates the constant velocity of a sphere falling in a viscous fluid.",
    variables: [
      { symbol: "r", meaning: "radius of sphere" },
      { symbol: "\\rho_s,\\rho_f", meaning: "density of sphere and fluid" },
      { symbol: "\\eta", meaning: "viscosity of fluid" },
    ],
    example: "Find terminal velocity of a small ball bearing in oil",
  },

  // =========================
  // CHEMISTRY — Solutions & Gas Laws
  // =========================
  {
    id: 409,
    title: "Molarity",
    subject: "Chemistry",
    category: "Concentration",
    level: "Foundational",
    formula: "M = \\frac{n}{V}",
    explanation: "Calculates the concentration of a solution in moles per litre.",
    variables: [
      { symbol: "n", meaning: "number of moles of solute" },
      { symbol: "V", meaning: "volume of solution in litres" },
    ],
    example: "Find molarity for 2mol dissolved in 4L of solution",
  },
  {
    id: 410,
    title: "Dilution Formula",
    subject: "Chemistry",
    category: "Concentration",
    level: "Foundational",
    formula: "M_1V_1 = M_2V_2",
    explanation: "Relates concentration and volume before and after dilution.",
    variables: [
      { symbol: "M_1,V_1", meaning: "initial molarity and volume" },
      { symbol: "M_2,V_2", meaning: "final molarity and volume" },
    ],
    example: "Find V2 when M1=2M, V1=100mL, M2=0.5M",
  },
  {
    id: 411,
    title: "Mole Fraction",
    subject: "Chemistry",
    category: "Concentration",
    level: "University",
    formula: "X_A = \\frac{n_A}{n_A + n_B}",
    explanation: "Calculates the fraction of moles of a component in a mixture.",
    variables: [
      { symbol: "n_A", meaning: "moles of component A" },
      { symbol: "n_B", meaning: "moles of component B" },
    ],
    example: "Find mole fraction of solute in a mixture",
  },
  {
    id: 412,
    title: "Ideal Gas Law (Chemistry Form)",
    subject: "Chemistry",
    category: "Gas Laws",
    level: "University",
    formula: "PV = nRT",
    explanation: "Relates pressure, volume, moles, and temperature of an ideal gas.",
    variables: [
      { symbol: "P", meaning: "pressure" },
      { symbol: "V", meaning: "volume" },
      { symbol: "n", meaning: "number of moles" },
      { symbol: "R", meaning: "universal gas constant" },
      { symbol: "T", meaning: "temperature (K)" },
    ],
    example: "Find volume of 1mol gas at STP",
  },
  {
    id: 413,
    title: "Graham's Law of Diffusion",
    subject: "Chemistry",
    category: "Gas Laws",
    level: "University",
    formula: "\\frac{r_1}{r_2} = \\sqrt{\\frac{M_2}{M_1}}",
    explanation: "Compares diffusion rates of two gases based on their molar masses.",
    variables: [
      { symbol: "r_1,r_2", meaning: "rates of diffusion of gas 1 and 2" },
      { symbol: "M_1,M_2", meaning: "molar masses of gas 1 and 2" },
    ],
    example: "Compare diffusion rates of hydrogen and oxygen",
  },

  // =========================
  // CHEMISTRY — Acids, Bases & Equilibrium
  // =========================
  {
    id: 414,
    title: "pH Formula",
    subject: "Chemistry",
    category: "Acids and Bases",
    level: "Foundational",
    formula: "pH = -\\log[H^+]",
    explanation: "Measures the acidity of a solution.",
    variables: [
      { symbol: "[H^+]", meaning: "hydrogen ion concentration" },
    ],
    example: "Find pH when [H+]=1×10⁻³ mol/L",
  },
  {
    id: 415,
    title: "pOH Formula",
    subject: "Chemistry",
    category: "Acids and Bases",
    level: "Foundational",
    formula: "pOH = -\\log[OH^-]",
    explanation: "Measures the basicity of a solution.",
    variables: [
      { symbol: "[OH^-]", meaning: "hydroxide ion concentration" },
    ],
    example: "Find pOH when [OH-]=1×10⁻⁴ mol/L",
  },
  {
    id: 416,
    title: "Relationship Between pH and pOH",
    subject: "Chemistry",
    category: "Acids and Bases",
    level: "Foundational",
    formula: "pH + pOH = 14",
    explanation: "Relates pH and pOH at 25°C.",
    variables: [
      { symbol: "pH,pOH", meaning: "acidity and basicity measures" },
    ],
    example: "Find pOH when pH=4",
  },
  {
    id: 417,
    title: "Equilibrium Constant Expression",
    subject: "Chemistry",
    category: "Chemical Equilibrium",
    level: "University",
    formula: "K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}",
    explanation: "Expresses the equilibrium constant for a reversible reaction.",
    variables: [
      { symbol: "[A],[B],[C],[D]", meaning: "equilibrium concentrations" },
      { symbol: "a,b,c,d", meaning: "stoichiometric coefficients" },
    ],
    example: "Write Kc for N2 + 3H2 ⇌ 2NH3",
  },
  {
    id: 418,
    title: "Henderson-Hasselbalch Equation",
    subject: "Chemistry",
    category: "Acids and Bases",
    level: "University",
    formula: "pH = pK_a + \\log\\frac{[A^-]}{[HA]}",
    explanation: "Calculates pH of a buffer solution.",
    variables: [
      { symbol: "pK_a", meaning: "acid dissociation constant (-log Ka)" },
      { symbol: "[A^-]", meaning: "conjugate base concentration" },
      { symbol: "[HA]", meaning: "weak acid concentration" },
    ],
    example: "Find pH of a buffer with pKa=4.76",
  },

  // =========================
  // CHEMISTRY — Thermochemistry & Kinetics
  // =========================
  {
    id: 419,
    title: "Hess's Law",
    subject: "Chemistry",
    category: "Thermochemistry",
    level: "University",
    formula: "\\Delta H = \\sum \\Delta H_{products} - \\sum \\Delta H_{reactants}",
    explanation: "States that total enthalpy change is independent of the reaction pathway.",
    variables: [
      { symbol: "\\Delta H", meaning: "enthalpy change of reaction" },
    ],
    example: "Find ΔH of a reaction using known enthalpies of formation",
  },
  {
    id: 420,
    title: "Gibbs Free Energy",
    subject: "Chemistry",
    category: "Thermochemistry",
    level: "University",
    formula: "\\Delta G = \\Delta H - T\\Delta S",
    explanation: "Determines the spontaneity of a chemical reaction.",
    variables: [
      { symbol: "\\Delta H", meaning: "enthalpy change" },
      { symbol: "T", meaning: "absolute temperature" },
      { symbol: "\\Delta S", meaning: "entropy change" },
    ],
    example: "Determine spontaneity given ΔH=-50kJ, ΔS=100J/K, T=300K",
  },
  {
    id: 421,
    title: "Arrhenius Equation",
    subject: "Chemistry",
    category: "Chemical Kinetics",
    level: "University",
    formula: "k = Ae^{-E_a/RT}",
    explanation: "Relates rate constant to temperature and activation energy.",
    variables: [
      { symbol: "k", meaning: "rate constant" },
      { symbol: "A", meaning: "pre-exponential factor" },
      { symbol: "E_a", meaning: "activation energy" },
      { symbol: "R", meaning: "gas constant" },
      { symbol: "T", meaning: "temperature (K)" },
    ],
    example: "Find k given Ea, A, and T",
  },
  {
    id: 422,
    title: "Rate Law (General Form)",
    subject: "Chemistry",
    category: "Chemical Kinetics",
    level: "University",
    formula: "\\text{Rate} = k[A]^m[B]^n",
    explanation: "Expresses reaction rate as a function of reactant concentrations.",
    variables: [
      { symbol: "k", meaning: "rate constant" },
      { symbol: "[A],[B]", meaning: "reactant concentrations" },
      { symbol: "m,n", meaning: "reaction orders" },
    ],
    example: "Write rate law for a second order reaction",
  },
  {
    id: 423,
    title: "Half-Life of First Order Reaction",
    subject: "Chemistry",
    category: "Chemical Kinetics",
    level: "University",
    formula: "t_{1/2} = \\frac{0.693}{k}",
    explanation: "Calculates the half-life for a first-order chemical reaction.",
    variables: [
      { symbol: "k", meaning: "rate constant" },
    ],
    example: "Find half-life when k=0.02/s",
  },

  // =========================
  // CHEMISTRY — Stoichiometry & Electrochemistry
  // =========================
  {
    id: 424,
    title: "Percentage Yield",
    subject: "Chemistry",
    category: "Stoichiometry",
    level: "Foundational",
    formula: "\\%Yield = \\frac{\\text{Actual yield}}{\\text{Theoretical yield}}\\times 100",
    explanation: "Measures the efficiency of a chemical reaction.",
    variables: [
      { symbol: "Actual yield", meaning: "amount actually obtained" },
      { symbol: "Theoretical yield", meaning: "maximum possible amount" },
    ],
    example: "Find % yield when actual=8g, theoretical=10g",
  },
  {
    id: 425,
    title: "Percentage Purity",
    subject: "Chemistry",
    category: "Stoichiometry",
    level: "Foundational",
    formula: "\\%Purity = \\frac{\\text{mass of pure substance}}{\\text{mass of impure sample}}\\times 100",
    explanation: "Measures the purity level of a chemical sample.",
    variables: [
      { symbol: "mass of pure substance", meaning: "actual pure content" },
      { symbol: "mass of impure sample", meaning: "total sample mass" },
    ],
    example: "Find % purity for 9g pure substance in 10g sample",
  },
  {
    id: 426,
    title: "Faraday's First Law of Electrolysis",
    subject: "Chemistry",
    category: "Electrochemistry",
    level: "University",
    formula: "m = \\frac{ItM}{nF}",
    explanation: "Calculates the mass of substance deposited during electrolysis.",
    variables: [
      { symbol: "I", meaning: "current" },
      { symbol: "t", meaning: "time" },
      { symbol: "M", meaning: "molar mass" },
      { symbol: "n", meaning: "number of electrons transferred" },
      { symbol: "F", meaning: "Faraday's constant" },
    ],
    example: "Find mass of copper deposited using given current and time",
  },
  {
    id: 427,
    title: "Relative Molecular Mass from Vapour Density",
    subject: "Chemistry",
    category: "Stoichiometry",
    level: "Foundational",
    formula: "M_r = 2 \\times VD",
    explanation: "Calculates relative molecular mass from vapour density.",
    variables: [
      { symbol: "VD", meaning: "vapour density" },
    ],
    example: "Find Mr when vapour density = 22",
  },

  // =========================
  // BIOLOGY
  // =========================
  {
    id: 428,
    title: "Magnification Formula (Microscopy)",
    subject: "Biology",
    category: "Microscopy",
    level: "Foundational",
    formula: "M = \\frac{\\text{Image size}}{\\text{Actual size}}",
    explanation: "Calculates magnification of a specimen under a microscope.",
    variables: [
      { symbol: "Image size", meaning: "size of image observed" },
      { symbol: "Actual size", meaning: "true size of specimen" },
    ],
    example: "Find magnification for image=5mm, actual=0.05mm",
  },
  {
    id: 429,
    title: "Surface Area to Volume Ratio",
    subject: "Biology",
    category: "Cell Biology",
    level: "Foundational",
    formula: "SA:V = \\frac{\\text{Surface Area}}{\\text{Volume}}",
    explanation: "Compares surface area to volume, important for diffusion efficiency.",
    variables: [
      { symbol: "Surface Area", meaning: "total outer area of an organism/cell" },
      { symbol: "Volume", meaning: "total volume" },
    ],
    example: "Find SA:V ratio for a cube of side 2cm",
  },
  {
    id: 430,
    title: "Hardy-Weinberg Equation",
    subject: "Biology",
    category: "Genetics",
    level: "University",
    formula: "p^2 + 2pq + q^2 = 1",
    explanation: "Predicts genotype frequencies in a stable, non-evolving population.",
    variables: [
      { symbol: "p", meaning: "frequency of dominant allele" },
      { symbol: "q", meaning: "frequency of recessive allele" },
    ],
    example: "Find genotype frequencies given p=0.6, q=0.4",
  },
  {
    id: 431,
    title: "Population Growth Rate",
    subject: "Biology",
    category: "Ecology",
    level: "University",
    formula: "r = \\frac{(B-D)}{N}",
    explanation: "Calculates the per capita growth rate of a population.",
    variables: [
      { symbol: "B", meaning: "births" },
      { symbol: "D", meaning: "deaths" },
      { symbol: "N", meaning: "population size" },
    ],
    example: "Find growth rate given births, deaths and population size",
  },
  {
    id: 432,
    title: "Body Mass Index (BMI)",
    subject: "Biology",
    category: "Human Physiology",
    level: "Foundational",
    formula: "BMI = \\frac{\\text{mass (kg)}}{\\text{height}^2 (m^2)}",
    explanation: "Measures body fat based on height and weight.",
    variables: [
      { symbol: "mass", meaning: "body weight in kilograms" },
      { symbol: "height", meaning: "height in metres" },
    ],
    example: "Find BMI for mass=70kg, height=1.75m",
  },
  {
    id: 433,
    title: "Pulse Rate Formula",
    subject: "Biology",
    category: "Human Physiology",
    level: "Foundational",
    formula: "\\text{Pulse Rate} = \\frac{\\text{Number of beats}}{\\text{Time (minutes)}}",
    explanation: "Calculates heart rate from counted beats over time.",
    variables: [
      { symbol: "Number of beats", meaning: "counted heartbeats" },
      { symbol: "Time", meaning: "duration of counting in minutes" },
    ],
    example: "Find pulse rate for 72 beats in 1 minute",
  },
  {
    id: 434,
    title: "Rate of Enzyme Reaction",
    subject: "Biology",
    category: "Biochemistry",
    level: "University",
    formula: "\\text{Rate} = \\frac{\\text{Amount of product formed}}{\\text{Time taken}}",
    explanation: "Measures the speed of an enzyme-catalyzed reaction.",
    variables: [
      { symbol: "Amount of product formed", meaning: "quantity produced" },
      { symbol: "Time taken", meaning: "duration of reaction" },
    ],
    example: "Find rate for 20cm³ gas produced in 40s",
  },

  // =========================
  // ECONOMICS
  // =========================
  {
    id: 435,
    title: "Price Elasticity of Demand",
    subject: "Economics",
    category: "Microeconomics",
    level: "Foundational",
    formula: "E_d = \\frac{\\%\\Delta Q_d}{\\%\\Delta P}",
    explanation: "Measures responsiveness of quantity demanded to price changes.",
    variables: [
      { symbol: "\\%\\Delta Q_d", meaning: "percentage change in quantity demanded" },
      { symbol: "\\%\\Delta P", meaning: "percentage change in price" },
    ],
    example: "Find Ed when price rises 10% and demand falls 20%",
  },
  {
    id: 436,
    title: "Income Elasticity of Demand",
    subject: "Economics",
    category: "Microeconomics",
    level: "Foundational",
    formula: "E_y = \\frac{\\%\\Delta Q_d}{\\%\\Delta Y}",
    explanation: "Measures responsiveness of demand to changes in income.",
    variables: [
      { symbol: "\\%\\Delta Q_d", meaning: "percentage change in quantity demanded" },
      { symbol: "\\%\\Delta Y", meaning: "percentage change in income" },
    ],
    example: "Find Ey when income rises 5% and demand rises 10%",
  },
  {
    id: 437,
    title: "Price Elasticity of Supply",
    subject: "Economics",
    category: "Microeconomics",
    level: "Foundational",
    formula: "E_s = \\frac{\\%\\Delta Q_s}{\\%\\Delta P}",
    explanation: "Measures responsiveness of quantity supplied to price changes.",
    variables: [
      { symbol: "\\%\\Delta Q_s", meaning: "percentage change in quantity supplied" },
      { symbol: "\\%\\Delta P", meaning: "percentage change in price" },
    ],
    example: "Find Es when price rises 10% and supply rises 15%",
  },
  {
    id: 438,
    title: "Multiplier",
    subject: "Economics",
    category: "Macroeconomics",
    level: "University",
    formula: "k = \\frac{1}{1-MPC}",
    explanation: "Calculates the effect of an initial spending change on total income.",
    variables: [
      { symbol: "MPC", meaning: "marginal propensity to consume" },
    ],
    example: "Find multiplier when MPC=0.8",
  },
  {
    id: 439,
    title: "Marginal Propensity to Consume",
    subject: "Economics",
    category: "Macroeconomics",
    level: "University",
    formula: "MPC = \\frac{\\Delta C}{\\Delta Y}",
    explanation: "Measures the change in consumption resulting from a change in income.",
    variables: [
      { symbol: "\\Delta C", meaning: "change in consumption" },
      { symbol: "\\Delta Y", meaning: "change in income" },
    ],
    example: "Find MPC when income rises by ₦1000 and consumption by ₦800",
  },
  {
    id: 440,
    title: "Marginal Propensity to Save",
    subject: "Economics",
    category: "Macroeconomics",
    level: "University",
    formula: "MPS = 1 - MPC",
    explanation: "Measures the proportion of additional income that is saved.",
    variables: [
      { symbol: "MPC", meaning: "marginal propensity to consume" },
    ],
    example: "Find MPS when MPC=0.75",
  },
  {
    id: 441,
    title: "Gross Domestic Product (Expenditure Approach)",
    subject: "Economics",
    category: "Macroeconomics",
    level: "University",
    formula: "GDP = C + I + G + (X-M)",
    explanation: "Calculates GDP by summing all expenditure in an economy.",
    variables: [
      { symbol: "C", meaning: "consumption" },
      { symbol: "I", meaning: "investment" },
      { symbol: "G", meaning: "government spending" },
      { symbol: "X-M", meaning: "net exports" },
    ],
    example: "Find GDP given values for C, I, G, X, and M",
  },
  {
    id: 442,
    title: "Break-Even Point (Units)",
    subject: "Economics",
    category: "Business Economics",
    level: "Foundational",
    formula: "Q_{BE} = \\frac{FC}{P - VC}",
    explanation: "Calculates the number of units needed to cover total costs.",
    variables: [
      { symbol: "FC", meaning: "fixed costs" },
      { symbol: "P", meaning: "selling price per unit" },
      { symbol: "VC", meaning: "variable cost per unit" },
    ],
    example: "Find break-even quantity for FC=₦50,000, P=₦500, VC=₦300",
  },
  {
    id: 443,
    title: "Total Revenue",
    subject: "Economics",
    category: "Business Economics",
    level: "Foundational",
    formula: "TR = P \\times Q",
    explanation: "Calculates total revenue from sales.",
    variables: [
      { symbol: "P", meaning: "price per unit" },
      { symbol: "Q", meaning: "quantity sold" },
    ],
    example: "Find TR for P=₦200, Q=500 units",
  },

  // =========================
  // ACCOUNTING / COMMERCE
  // =========================
  {
    id: 444,
    title: "Accounting Equation",
    subject: "Accounting",
    category: "Financial Accounting",
    level: "Foundational",
    formula: "Assets = Liabilities + Owner's Equity",
    explanation: "The fundamental equation representing a business's financial position.",
    variables: [
      { symbol: "Assets", meaning: "what the business owns" },
      { symbol: "Liabilities", meaning: "what the business owes" },
      { symbol: "Owner's Equity", meaning: "owner's claim on assets" },
    ],
    example: "Find equity when assets=₦500,000, liabilities=₦200,000",
  },
  {
    id: 445,
    title: "Gross Profit",
    subject: "Accounting",
    category: "Financial Accounting",
    level: "Foundational",
    formula: "Gross Profit = Sales - Cost of Goods Sold",
    explanation: "Measures profit before deducting operating expenses.",
    variables: [
      { symbol: "Sales", meaning: "total sales revenue" },
      { symbol: "Cost of Goods Sold", meaning: "direct cost of producing goods sold" },
    ],
    example: "Find gross profit for sales=₦1,000,000, COGS=₦600,000",
  },
  {
    id: 446,
    title: "Net Profit",
    subject: "Accounting",
    category: "Financial Accounting",
    level: "Foundational",
    formula: "Net Profit = Gross Profit - Expenses",
    explanation: "Measures the actual profit after all expenses are deducted.",
    variables: [
      { symbol: "Gross Profit", meaning: "profit before operating expenses" },
      { symbol: "Expenses", meaning: "operating and other expenses" },
    ],
    example: "Find net profit for gross profit=₦400,000, expenses=₦150,000",
  },
  {
    id: 447,
    title: "Straight-Line Depreciation",
    subject: "Accounting",
    category: "Financial Accounting",
    level: "Foundational",
    formula: "D = \\frac{\\text{Cost} - \\text{Salvage Value}}{\\text{Useful Life}}",
    explanation: "Calculates annual depreciation using the straight-line method.",
    variables: [
      { symbol: "Cost", meaning: "original cost of the asset" },
      { symbol: "Salvage Value", meaning: "estimated value at end of useful life" },
      { symbol: "Useful Life", meaning: "expected years of use" },
    ],
    example: "Find annual depreciation for cost=₦1,000,000, salvage=₦100,000, life=5yrs",
  },
  {
    id: 448,
    title: "Reducing Balance Depreciation",
    subject: "Accounting",
    category: "Financial Accounting",
    level: "University",
    formula: "D = NBV \\times r",
    explanation: "Calculates depreciation as a fixed percentage of net book value.",
    variables: [
      { symbol: "NBV", meaning: "net book value at start of period" },
      { symbol: "r", meaning: "depreciation rate" },
    ],
    example: "Find depreciation for NBV=₦500,000, rate=20%",
  },
  {
    id: 449,
    title: "Current Ratio",
    subject: "Accounting",
    category: "Financial Ratios",
    level: "University",
    formula: "\\text{Current Ratio} = \\frac{\\text{Current Assets}}{\\text{Current Liabilities}}",
    explanation: "Measures a company's ability to pay short-term obligations.",
    variables: [
      { symbol: "Current Assets", meaning: "assets convertible to cash within a year" },
      { symbol: "Current Liabilities", meaning: "debts due within a year" },
    ],
    example: "Find current ratio for assets=₦600,000, liabilities=₦300,000",
  },
  {
    id: 450,
    title: "Quick Ratio (Acid Test)",
    subject: "Accounting",
    category: "Financial Ratios",
    level: "University",
    formula: "\\text{Quick Ratio} = \\frac{\\text{Current Assets} - \\text{Inventory}}{\\text{Current Liabilities}}",
    explanation: "Measures short-term liquidity excluding inventory.",
    variables: [
      { symbol: "Inventory", meaning: "value of stock on hand" },
    ],
    example: "Find quick ratio when inventory is subtracted from current assets",
  },
  {
    id: 451,
    title: "Return on Investment (ROI)",
    subject: "Accounting",
    category: "Financial Ratios",
    level: "University",
    formula: "ROI = \\frac{\\text{Net Profit}}{\\text{Investment Cost}}\\times 100",
    explanation: "Measures the profitability of an investment.",
    variables: [
      { symbol: "Net Profit", meaning: "profit generated from investment" },
      { symbol: "Investment Cost", meaning: "total amount invested" },
    ],
    example: "Find ROI for profit=₦50,000, investment=₦250,000",
  },
  {
    id: 452,
    title: "Working Capital",
    subject: "Accounting",
    category: "Financial Ratios",
    level: "Foundational",
    formula: "\\text{Working Capital} = \\text{Current Assets} - \\text{Current Liabilities}",
    explanation: "Measures a company's short-term financial health.",
    variables: [
      { symbol: "Current Assets", meaning: "assets convertible to cash within a year" },
      { symbol: "Current Liabilities", meaning: "debts due within a year" },
    ],
    example: "Find working capital for assets=₦700,000, liabilities=₦400,000",
  },
  {
    id: 453,
    title: "Stock Turnover Ratio",
    subject: "Commerce",
    category: "Trade",
    level: "University",
    formula: "\\text{Stock Turnover} = \\frac{\\text{COGS}}{\\text{Average Stock}}",
    explanation: "Measures how many times inventory is sold and replaced over a period.",
    variables: [
      { symbol: "COGS", meaning: "cost of goods sold" },
      { symbol: "Average Stock", meaning: "average value of inventory" },
    ],
    example: "Find turnover for COGS=₦600,000, average stock=₦100,000",
  },
  {
    id: 454,
    title: "Trade Discount",
    subject: "Commerce",
    category: "Trade",
    level: "Foundational",
    formula: "\\text{Trade Discount} = \\text{List Price} \\times \\text{Discount Rate}",
    explanation: "Calculates the reduction given off the list price of goods.",
    variables: [
      { symbol: "List Price", meaning: "original marked price" },
      { symbol: "Discount Rate", meaning: "percentage discount offered" },
    ],
    example: "Find trade discount for list price=₦20,000, rate=10%",
  },
  {
    id: 455,
    title: "Markup",
    subject: "Commerce",
    category: "Trade",
    level: "Foundational",
    formula: "\\text{Markup \\%} = \\frac{\\text{Selling Price} - \\text{Cost Price}}{\\text{Cost Price}}\\times 100",
    explanation: "Measures the percentage added to cost price to determine selling price.",
    variables: [
      { symbol: "Selling Price", meaning: "final price sold to customer" },
      { symbol: "Cost Price", meaning: "price paid to acquire the goods" },
    ],
    example: "Find markup % for cost=₦500, selling price=₦650",
  },
  {
    id: 456,
    title: "Margin",
    subject: "Commerce",
    category: "Trade",
    level: "Foundational",
    formula: "\\text{Margin \\%} = \\frac{\\text{Selling Price} - \\text{Cost Price}}{\\text{Selling Price}}\\times 100",
    explanation: "Measures profit as a percentage of the selling price.",
    variables: [
      { symbol: "Selling Price", meaning: "final price sold to customer" },
      { symbol: "Cost Price", meaning: "price paid to acquire the goods" },
    ],
    example: "Find margin % for cost=₦500, selling price=₦650",
  },

  // =========================
  // STATISTICS (standalone subject)
  // =========================
  {
    id: 457,
    title: "Coefficient of Variation",
    subject: "Statistics",
    category: "Measures of Dispersion",
    level: "University",
    formula: "CV = \\frac{\\sigma}{\\bar{x}}\\times 100",
    explanation: "Expresses standard deviation as a percentage of the mean.",
    variables: [
      { symbol: "\\sigma", meaning: "standard deviation" },
      { symbol: "\\bar{x}", meaning: "mean" },
    ],
    example: "Find CV for σ=5, mean=25",
  },
  {
    id: 458,
    title: "Pearson's Correlation Coefficient",
    subject: "Statistics",
    category: "Correlation",
    level: "University",
    formula: "r = \\frac{n\\sum xy - \\sum x\\sum y}{\\sqrt{[n\\sum x^2-(\\sum x)^2][n\\sum y^2-(\\sum y)^2]}}",
    explanation: "Measures the strength and direction of a linear relationship between two variables.",
    variables: [
      { symbol: "x,y", meaning: "paired data values" },
      { symbol: "n", meaning: "number of pairs" },
    ],
    example: "Find r for a set of paired data",
  },
  {
    id: 459,
    title: "Simple Linear Regression Line",
    subject: "Statistics",
    category: "Regression",
    level: "University",
    formula: "y = a + bx",
    explanation: "Models the linear relationship between a dependent and independent variable.",
    variables: [
      { symbol: "a", meaning: "y-intercept" },
      { symbol: "b", meaning: "slope of the regression line" },
    ],
    example: "Fit a regression line to sample data",
  },
  {
    id: 460,
    title: "Standard Error of the Mean",
    subject: "Statistics",
    category: "Sampling",
    level: "University",
    formula: "SE = \\frac{\\sigma}{\\sqrt{n}}",
    explanation: "Measures how much a sample mean is expected to vary from the population mean.",
    variables: [
      { symbol: "\\sigma", meaning: "population standard deviation" },
      { symbol: "n", meaning: "sample size" },
    ],
    example: "Find SE for σ=10, n=25",
  },
  {
    id: 461,
    title: "Chi-Square Statistic",
    subject: "Statistics",
    category: "Hypothesis Testing",
    level: "University",
    formula: "\\chi^2 = \\sum \\frac{(O-E)^2}{E}",
    explanation: "Tests whether observed data fits an expected distribution.",
    variables: [
      { symbol: "O", meaning: "observed frequency" },
      { symbol: "E", meaning: "expected frequency" },
    ],
    example: "Test independence of two categorical variables",
  },
  {
    id: 462,
    title: "Quartile Deviation",
    subject: "Statistics",
    category: "Measures of Dispersion",
    level: "Foundational",
    formula: "QD = \\frac{Q_3 - Q_1}{2}",
    explanation: "Measures spread using the interquartile range.",
    variables: [
      { symbol: "Q_1,Q_3", meaning: "first and third quartiles" },
    ],
    example: "Find QD when Q1=20, Q3=40",
  },

  // =========================
  // AGRICULTURAL SCIENCE
  // =========================
  {
    id: 463,
    title: "Stocking Rate",
    subject: "Agricultural Science",
    category: "Animal Husbandry",
    level: "Foundational",
    formula: "\\text{Stocking Rate} = \\frac{\\text{Number of Animals}}{\\text{Land Area}}",
    explanation: "Measures the number of animals per unit area of land.",
    variables: [
      { symbol: "Number of Animals", meaning: "total livestock reared" },
      { symbol: "Land Area", meaning: "size of grazing land" },
    ],
    example: "Find stocking rate for 50 cattle on 10 hectares",
  },
  {
    id: 464,
    title: "Feed Conversion Ratio",
    subject: "Agricultural Science",
    category: "Animal Husbandry",
    level: "Foundational",
    formula: "FCR = \\frac{\\text{Feed Intake}}{\\text{Weight Gain}}",
    explanation: "Measures the efficiency of converting feed into body mass.",
    variables: [
      { symbol: "Feed Intake", meaning: "total mass of feed consumed" },
      { symbol: "Weight Gain", meaning: "total mass gained by the animal" },
    ],
    example: "Find FCR for 100kg feed producing 25kg weight gain",
  },
  {
    id: 465,
    title: "Fertilizer Application Rate",
    subject: "Agricultural Science",
    category: "Soil Science",
    level: "Foundational",
    formula: "\\text{Rate} = \\frac{\\text{Nutrient Needed}}{\\text{\\% Nutrient in Fertilizer}}\\times 100",
    explanation: "Calculates the quantity of fertilizer needed to supply a target nutrient level.",
    variables: [
      { symbol: "Nutrient Needed", meaning: "required nutrient quantity" },
      { symbol: "\\% Nutrient in Fertilizer", meaning: "concentration of nutrient in fertilizer" },
    ],
    example: "Find fertilizer needed to supply 50kg N using a 20% N fertilizer",
  },
  {
    id: 466,
    title: "Germination Percentage",
    subject: "Agricultural Science",
    category: "Crop Production",
    level: "Foundational",
    formula: "\\%Germination = \\frac{\\text{Number germinated}}{\\text{Total seeds sown}}\\times 100",
    explanation: "Measures the viability of a seed sample.",
    variables: [
      { symbol: "Number germinated", meaning: "seeds that successfully sprouted" },
      { symbol: "Total seeds sown", meaning: "total number of seeds planted" },
    ],
    example: "Find germination % for 90 seeds germinated out of 100 sown",
  },
  {
    id: 467,
    title: "Land Equivalent Ratio",
    subject: "Agricultural Science",
    category: "Crop Production",
    level: "University",
    formula: "LER = \\frac{Y_a}{Y_{aa}} + \\frac{Y_b}{Y_{bb}}",
    explanation: "Compares yield efficiency of intercropping versus monocropping.",
    variables: [
      { symbol: "Y_a,Y_b", meaning: "yield of crops A and B in intercrop" },
      { symbol: "Y_{aa},Y_{bb}", meaning: "yield of crops A and B in monocrop" },
    ],
    example: "Find LER for maize-cowpea intercropping",
  },

  // =========================
  // COMPUTER SCIENCE
  // =========================
  {
    id: 468,
    title: "Binary to Decimal Conversion",
    subject: "Computer Science",
    category: "Number Systems",
    level: "Foundational",
    formula: "N_{10} = \\sum_{i=0}^{n} b_i \\times 2^i",
    explanation: "Converts a binary number to its decimal equivalent.",
    variables: [
      { symbol: "b_i", meaning: "binary digit at position i" },
    ],
    example: "Convert 1011₂ to decimal",
  },
  {
    id: 469,
    title: "Storage Capacity Formula",
    subject: "Computer Science",
    category: "Data Representation",
    level: "Foundational",
    formula: "\\text{Capacity} = \\text{bits} \\div 8 = \\text{bytes}",
    explanation: "Converts bits to bytes to determine storage capacity.",
    variables: [
      { symbol: "bits", meaning: "number of binary digits" },
    ],
    example: "Convert 4096 bits to bytes",
  },
  {
    id: 470,
    title: "Boolean AND Law",
    subject: "Computer Science",
    category: "Boolean Algebra",
    level: "Foundational",
    formula: "A \\cdot 1 = A, \\quad A \\cdot 0 = 0",
    explanation: "Identity and null laws for AND operation in Boolean algebra.",
    variables: [
      { symbol: "A", meaning: "Boolean variable" },
    ],
    example: "Simplify A·1 and A·0",
  },
  {
    id: 471,
    title: "De Morgan's Theorem (Boolean Algebra)",
    subject: "Computer Science",
    category: "Boolean Algebra",
    level: "University",
    formula: "\\overline{A+B} = \\bar{A}\\cdot\\bar{B}",
    explanation: "Relates the complement of a sum to the product of complements in logic circuits.",
    variables: [
      { symbol: "A,B", meaning: "Boolean variables" },
    ],
    example: "Simplify NOT(A OR B) using De Morgan's theorem",
  },
  {
    id: 472,
    title: "Big O Complexity (Linear)",
    subject: "Computer Science",
    category: "Algorithms",
    level: "University",
    formula: "O(n)",
    explanation: "Describes an algorithm whose running time grows linearly with input size.",
    variables: [
      { symbol: "n", meaning: "size of input" },
    ],
    example: "Analyze time complexity of a single loop through an array",
  },
  {
    id: 473,
    title: "Data Transmission Time",
    subject: "Computer Science",
    category: "Networking",
    level: "Foundational",
    formula: "t = \\frac{\\text{File Size}}{\\text{Bandwidth}}",
    explanation: "Estimates time required to transmit data over a network.",
    variables: [
      { symbol: "File Size", meaning: "size of data being transmitted" },
      { symbol: "Bandwidth", meaning: "data transfer rate of the network" },
    ],
    example: "Find transmission time for a 100MB file over a 10Mbps link",
  },

  // =========================
  // GEOGRAPHY
  // =========================
  {
    id: 474,
    title: "Population Density",
    subject: "Geography",
    category: "Population Geography",
    level: "Foundational",
    formula: "PD = \\frac{\\text{Population}}{\\text{Land Area}}",
    explanation: "Measures the number of people per unit area of land.",
    variables: [
      { symbol: "Population", meaning: "total number of people" },
      { symbol: "Land Area", meaning: "total area of land in km²" },
    ],
    example: "Find population density for 2,000,000 people in 500km²",
  },
  {
    id: 475,
    title: "Map Scale (Representative Fraction)",
    subject: "Geography",
    category: "Map Reading",
    level: "Foundational",
    formula: "\\text{Scale} = \\frac{\\text{Map Distance}}{\\text{Ground Distance}}",
    explanation: "Expresses the ratio between map distance and actual ground distance.",
    variables: [
      { symbol: "Map Distance", meaning: "distance measured on the map" },
      { symbol: "Ground Distance", meaning: "corresponding real-world distance" },
    ],
    example: "Find scale for 5cm map distance representing 5km ground distance",
  },
  {
    id: 476,
    title: "Gradient (Slope Between Two Points)",
    subject: "Geography",
    category: "Map Reading",
    level: "Foundational",
    formula: "\\text{Gradient} = \\frac{\\text{Vertical Interval}}{\\text{Horizontal Equivalent}}",
    explanation: "Measures the steepness of terrain between two points on a map.",
    variables: [
      { symbol: "Vertical Interval", meaning: "difference in height between two points" },
      { symbol: "Horizontal Equivalent", meaning: "horizontal distance between the points" },
    ],
    example: "Find gradient for a 100m rise over 2000m horizontal distance",
  },
  {
    id: 477,
    title: "Population Growth Rate (Geography)",
    subject: "Geography",
    category: "Population Geography",
    level: "Foundational",
    formula: "\\text{Growth Rate} = \\frac{\\text{Births} - \\text{Deaths}}{\\text{Population}}\\times 100",
    explanation: "Measures the natural rate of population increase.",
    variables: [
      { symbol: "Births,Deaths", meaning: "number of births and deaths" },
      { symbol: "Population", meaning: "total population" },
    ],
    example: "Find growth rate for a town with given births and deaths",
  },
  // =========================
  // MATHEMATICS — Calculus
  // =========================
  {
    id: 478,
    title: "Power Rule of Differentiation",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "\\frac{d}{dx}(x^n) = nx^{n-1}",
    explanation: "Differentiates a power of x.",
    variables: [
      { symbol: "x", meaning: "variable" },
      { symbol: "n", meaning: "power/exponent" },
    ],
    example: "Differentiate x⁵",
  },
  {
    id: 479,
    title: "Product Rule of Differentiation",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "\\frac{d}{dx}(uv) = u\\frac{dv}{dx} + v\\frac{du}{dx}",
    explanation: "Differentiates the product of two functions.",
    variables: [
      { symbol: "u,v", meaning: "functions of x" },
    ],
    example: "Differentiate y = x²sin x",
  },
  {
    id: 480,
    title: "Quotient Rule of Differentiation",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "\\frac{d}{dx}\\left(\\frac{u}{v}\\right) = \\frac{v\\frac{du}{dx}-u\\frac{dv}{dx}}{v^2}",
    explanation: "Differentiates the quotient of two functions.",
    variables: [
      { symbol: "u,v", meaning: "functions of x" },
    ],
    example: "Differentiate y = x/(x+1)",
  },
  {
    id: 481,
    title: "Chain Rule",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "\\frac{dy}{dx} = \\frac{dy}{du}\\times\\frac{du}{dx}",
    explanation: "Differentiates a composite function.",
    variables: [
      { symbol: "y", meaning: "function of u" },
      { symbol: "u", meaning: "function of x" },
    ],
    example: "Differentiate y = (3x+1)⁴",
  },
  {
    id: 482,
    title: "Derivative of Sine",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "\\frac{d}{dx}(\\sin x) = \\cos x",
    explanation: "Differentiates the sine function.",
    variables: [
      { symbol: "x", meaning: "angle in radians" },
    ],
    example: "Differentiate y = sin x",
  },
  {
    id: 483,
    title: "Derivative of Cosine",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "\\frac{d}{dx}(\\cos x) = -\\sin x",
    explanation: "Differentiates the cosine function.",
    variables: [
      { symbol: "x", meaning: "angle in radians" },
    ],
    example: "Differentiate y = cos x",
  },
  {
    id: 484,
    title: "Derivative of e^x",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "\\frac{d}{dx}(e^x) = e^x",
    explanation: "The exponential function is its own derivative.",
    variables: [
      { symbol: "x", meaning: "variable" },
    ],
    example: "Differentiate y = e^x",
  },
  {
    id: 485,
    title: "Derivative of ln(x)",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "\\frac{d}{dx}(\\ln x) = \\frac{1}{x}",
    explanation: "Differentiates the natural logarithm function.",
    variables: [
      { symbol: "x", meaning: "variable (x > 0)" },
    ],
    example: "Differentiate y = ln x",
  },
  {
    id: 486,
    title: "Power Rule of Integration",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "\\int x^n dx = \\frac{x^{n+1}}{n+1} + C",
    explanation: "Integrates a power of x (for n ≠ -1).",
    variables: [
      { symbol: "n", meaning: "power/exponent" },
      { symbol: "C", meaning: "constant of integration" },
    ],
    example: "Integrate x³ dx",
  },
  {
    id: 487,
    title: "Integral of 1/x",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "\\int \\frac{1}{x}dx = \\ln|x| + C",
    explanation: "Integrates the reciprocal function.",
    variables: [
      { symbol: "x", meaning: "variable" },
      { symbol: "C", meaning: "constant of integration" },
    ],
    example: "Integrate 1/x dx",
  },
  {
    id: 488,
    title: "Definite Integral (Area Under Curve)",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "\\int_a^b f(x)dx = F(b) - F(a)",
    explanation: "Calculates the area under a curve between two limits.",
    variables: [
      { symbol: "F(x)", meaning: "antiderivative of f(x)" },
      { symbol: "a,b", meaning: "lower and upper limits" },
    ],
    example: "Find area under y=x² between x=0 and x=3",
  },
  {
    id: 489,
    title: "Integration by Parts",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "\\int u\\,dv = uv - \\int v\\,du",
    explanation: "Integrates the product of two functions.",
    variables: [
      { symbol: "u,v", meaning: "functions of x" },
    ],
    example: "Integrate x·e^x dx",
  },
  {
    id: 490,
    title: "Stationary Point Condition",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "\\frac{dy}{dx} = 0",
    explanation: "Locates turning points (maxima/minima) of a curve.",
    variables: [
      { symbol: "y", meaning: "function of x" },
    ],
    example: "Find stationary points of y=x³-3x",
  },

  // =========================
  // MATHEMATICS — Matrices & Number Bases
  // =========================
  {
    id: 491,
    title: "Determinant of a 2×2 Matrix",
    subject: "Mathematics",
    category: "Matrices",
    level: "University",
    formula: "\\det(A) = ad - bc",
    explanation: "Calculates the determinant of a 2×2 matrix.",
    variables: [
      { symbol: "a,b,c,d", meaning: "entries of the matrix" },
    ],
    example: "Find determinant of [[2,3],[1,4]]",
  },
  {
    id: 492,
    title: "Inverse of a 2×2 Matrix",
    subject: "Mathematics",
    category: "Matrices",
    level: "University",
    formula: "A^{-1} = \\frac{1}{ad-bc}\\begin{pmatrix}d & -b\\\\-c & a\\end{pmatrix}",
    explanation: "Finds the inverse of a 2×2 matrix.",
    variables: [
      { symbol: "a,b,c,d", meaning: "entries of the matrix" },
    ],
    example: "Find inverse of [[2,3],[1,4]]",
  },
  {
    id: 493,
    title: "Matrix Multiplication (2×2)",
    subject: "Mathematics",
    category: "Matrices",
    level: "University",
    formula: "AB = \\begin{pmatrix}a_1b_1+a_2c_1 & a_1b_2+a_2c_2\\\\c_1b_1+c_2c_1 & c_1b_2+c_2c_2\\end{pmatrix}",
    explanation: "Multiplies two 2×2 matrices together.",
    variables: [
      { symbol: "A,B", meaning: "2×2 matrices" },
    ],
    example: "Multiply two given 2×2 matrices",
  },
  {
    id: 494,
    title: "Cramer's Rule (2 Variables)",
    subject: "Mathematics",
    category: "Matrices",
    level: "University",
    formula: "x = \\frac{D_x}{D}, \\quad y = \\frac{D_y}{D}",
    explanation: "Solves simultaneous linear equations using determinants.",
    variables: [
      { symbol: "D", meaning: "determinant of coefficient matrix" },
      { symbol: "D_x,D_y", meaning: "determinants with columns replaced by constants" },
    ],
    example: "Solve 2x+y=5, x-y=1 using Cramer's rule",
  },
  {
    id: 495,
    title: "Conversion from Decimal to Binary",
    subject: "Mathematics",
    category: "Number Bases",
    level: "Foundational",
    formula: "N_{10} \\to \\sum b_i 2^i = N_2",
    explanation: "Converts a base-10 number to base-2 by repeated division.",
    variables: [
      { symbol: "N_{10}", meaning: "decimal number" },
      { symbol: "b_i", meaning: "binary digits" },
    ],
    example: "Convert 25 to binary",
  },
  {
    id: 496,
    title: "Surd Rationalization",
    subject: "Mathematics",
    category: "Surds",
    level: "Foundational",
    formula: "\\frac{1}{\\sqrt{a}} = \\frac{\\sqrt{a}}{a}",
    explanation: "Removes a surd from the denominator of a fraction.",
    variables: [
      { symbol: "a", meaning: "positive number under the root" },
    ],
    example: "Rationalize 1/√3",
  },
  {
    id: 497,
    title: "Simple Proportion",
    subject: "Mathematics",
    category: "Ratio and Proportion",
    level: "Foundational",
    formula: "\\frac{a}{b} = \\frac{c}{d}",
    explanation: "Expresses equality between two ratios.",
    variables: [
      { symbol: "a,b,c,d", meaning: "quantities in proportion" },
    ],
    example: "Find x if 3/4 = x/12",
  },
  {
    id: 498,
    title: "Bearing Between Two Points",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "Foundational",
    formula: "\\theta = \\tan^{-1}\\left(\\frac{\\Delta x}{\\Delta y}\\right)",
    explanation: "Calculates the bearing (direction) from one point to another.",
    variables: [
      { symbol: "\\Delta x,\\Delta y", meaning: "differences in coordinates" },
    ],
    example: "Find bearing from A(0,0) to B(3,4)",
  },

  // =========================
  // FURTHER MATHEMATICS — Mechanics
  // =========================
  {
    id: 499,
    title: "Impulse-Momentum Theorem",
    subject: "Further Mathematics",
    category: "Mechanics",
    level: "University",
    formula: "J = \\Delta p = m(v-u)",
    explanation: "Relates impulse to change in momentum.",
    variables: [
      { symbol: "J", meaning: "impulse" },
      { symbol: "m", meaning: "mass" },
      { symbol: "v,u", meaning: "final and initial velocity" },
    ],
    example: "Find impulse for m=2kg, u=3m/s, v=8m/s",
  },
  {
    id: 500,
    title: "Resultant of Two Forces",
    subject: "Further Mathematics",
    category: "Mechanics",
    level: "University",
    formula: "R = \\sqrt{F_1^2+F_2^2+2F_1F_2\\cos\\theta}",
    explanation: "Calculates the resultant of two forces acting at an angle.",
    variables: [
      { symbol: "F_1,F_2", meaning: "magnitudes of the two forces" },
      { symbol: "\\theta", meaning: "angle between the forces" },
    ],
    example: "Find resultant of forces 5N and 8N at 60°",
  },
  {
    id: 501,
    title: "Conservation of Momentum",
    subject: "Further Mathematics",
    category: "Mechanics",
    level: "University",
    formula: "m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2",
    explanation: "States that total momentum before and after collision is conserved.",
    variables: [
      { symbol: "m_1,m_2", meaning: "masses of the two bodies" },
      { symbol: "u_1,u_2", meaning: "initial velocities" },
      { symbol: "v_1,v_2", meaning: "final velocities" },
    ],
    example: "Find final velocity after a collision between two trolleys",
  },
  {
    id: 502,
    title: "Coefficient of Restitution",
    subject: "Further Mathematics",
    category: "Mechanics",
    level: "University",
    formula: "e = \\frac{v_2-v_1}{u_1-u_2}",
    explanation: "Measures the elasticity of a collision between two bodies.",
    variables: [
      { symbol: "u_1,u_2", meaning: "velocities before collision" },
      { symbol: "v_1,v_2", meaning: "velocities after collision" },
    ],
    example: "Find e for a collision given before/after velocities",
  },
  {
    id: 503,
    title: "Moment of a Force",
    subject: "Further Mathematics",
    category: "Statics",
    level: "University",
    formula: "M = F \\times d",
    explanation: "Calculates the turning effect of a force about a point.",
    variables: [
      { symbol: "F", meaning: "force applied" },
      { symbol: "d", meaning: "perpendicular distance from pivot" },
    ],
    example: "Find moment for F=10N, d=0.5m",
  },
  {
    id: 504,
    title: "Condition for Equilibrium of Coplanar Forces",
    subject: "Further Mathematics",
    category: "Statics",
    level: "University",
    formula: "\\sum F_x = 0, \\quad \\sum F_y = 0, \\quad \\sum M = 0",
    explanation: "States conditions for a rigid body to be in static equilibrium.",
    variables: [
      { symbol: "F_x,F_y", meaning: "force components" },
      { symbol: "M", meaning: "moments about a point" },
    ],
    example: "Find unknown forces for a beam in equilibrium",
  },

  // =========================
  // PHYSICS — Simple Harmonic Motion & Oscillation
  // =========================
  {
    id: 505,
    title: "Period of Simple Harmonic Motion",
    subject: "Physics",
    category: "Oscillation",
    level: "University",
    formula: "T = 2\\pi\\sqrt{\\frac{m}{k}}",
    explanation: "Calculates the period of oscillation for a mass-spring system.",
    variables: [
      { symbol: "m", meaning: "mass" },
      { symbol: "k", meaning: "spring constant" },
    ],
    example: "Find T for m=0.5kg, k=20N/m",
  },
  {
    id: 506,
    title: "Period of a Simple Pendulum",
    subject: "Physics",
    category: "Oscillation",
    level: "Foundational",
    formula: "T = 2\\pi\\sqrt{\\frac{l}{g}}",
    explanation: "Calculates the period of oscillation of a simple pendulum.",
    variables: [
      { symbol: "l", meaning: "length of pendulum" },
      { symbol: "g", meaning: "acceleration due to gravity" },
    ],
    example: "Find T for l=1m",
  },
  {
    id: 507,
    title: "Displacement in SHM",
    subject: "Physics",
    category: "Oscillation",
    level: "University",
    formula: "x = A\\sin(\\omega t)",
    explanation: "Describes displacement of an oscillating body over time.",
    variables: [
      { symbol: "A", meaning: "amplitude" },
      { symbol: "\\omega", meaning: "angular frequency" },
      { symbol: "t", meaning: "time" },
    ],
    example: "Find displacement at t=1s for A=0.2m, ω=2rad/s",
  },
  {
    id: 508,
    title: "Maximum Velocity in SHM",
    subject: "Physics",
    category: "Oscillation",
    level: "University",
    formula: "v_{max} = A\\omega",
    explanation: "Calculates the maximum speed of an oscillating body.",
    variables: [
      { symbol: "A", meaning: "amplitude" },
      { symbol: "\\omega", meaning: "angular frequency" },
    ],
    example: "Find vmax for A=0.1m, ω=5rad/s",
  },

  // =========================
  // PHYSICS — Electronics
  // =========================
  {
    id: 509,
    title: "Diode Forward Voltage Drop Relation",
    subject: "Physics",
    category: "Electronics",
    level: "University",
    formula: "V_R = V_S - V_D",
    explanation: "Calculates the voltage across a resistor in a diode circuit.",
    variables: [
      { symbol: "V_S", meaning: "supply voltage" },
      { symbol: "V_D", meaning: "diode voltage drop" },
    ],
    example: "Find VR for VS=9V, VD=0.7V",
  },
  {
    id: 510,
    title: "Transistor Current Gain",
    subject: "Physics",
    category: "Electronics",
    level: "University",
    formula: "\\beta = \\frac{I_C}{I_B}",
    explanation: "Relates collector current to base current in a transistor.",
    variables: [
      { symbol: "I_C", meaning: "collector current" },
      { symbol: "I_B", meaning: "base current" },
    ],
    example: "Find β for IC=2mA, IB=20μA",
  },
  {
    id: 511,
    title: "Reactance of a Capacitor",
    subject: "Physics",
    category: "AC Circuits",
    level: "University",
    formula: "X_C = \\frac{1}{2\\pi f C}",
    explanation: "Calculates the opposition to AC current offered by a capacitor.",
    variables: [
      { symbol: "f", meaning: "frequency" },
      { symbol: "C", meaning: "capacitance" },
    ],
    example: "Find Xc for f=50Hz, C=100μF",
  },
  {
    id: 512,
    title: "Reactance of an Inductor",
    subject: "Physics",
    category: "AC Circuits",
    level: "University",
    formula: "X_L = 2\\pi f L",
    explanation: "Calculates the opposition to AC current offered by an inductor.",
    variables: [
      { symbol: "f", meaning: "frequency" },
      { symbol: "L", meaning: "inductance" },
    ],
    example: "Find XL for f=50Hz, L=0.2H",
  },
  {
    id: 513,
    title: "RMS Value of AC Voltage",
    subject: "Physics",
    category: "AC Circuits",
    level: "University",
    formula: "V_{rms} = \\frac{V_0}{\\sqrt{2}}",
    explanation: "Calculates the root-mean-square value of an AC voltage.",
    variables: [
      { symbol: "V_0", meaning: "peak voltage" },
    ],
    example: "Find Vrms for V0=340V",
  },

  // =========================
  // PHYSICS — Nuclear & Thermodynamics
  // =========================
  {
    id: 514,
    title: "Nuclear Binding Energy",
    subject: "Physics",
    category: "Nuclear Physics",
    level: "University",
    formula: "E_b = \\Delta m c^2",
    explanation: "Calculates the energy holding a nucleus together from mass defect.",
    variables: [
      { symbol: "\\Delta m", meaning: "mass defect" },
      { symbol: "c", meaning: "speed of light" },
    ],
    example: "Find binding energy given a nucleus's mass defect",
  },
  {
    id: 516,
    title: "Efficiency of a Heat Engine",
    subject: "Physics",
    category: "Heat Engines",
    level: "University",
    formula: "\\eta = 1 - \\frac{T_c}{T_h}",
    explanation: "Calculates the maximum theoretical efficiency of a heat engine.",
    variables: [
      { symbol: "T_c", meaning: "temperature of cold reservoir (K)" },
      { symbol: "T_h", meaning: "temperature of hot reservoir (K)" },
    ],
    example: "Find efficiency for Tc=300K, Th=600K",
  },
  {
    id: 517,
    title: "Linear Thermal Expansion",
    subject: "Physics",
    category: "Heat",
    level: "University",
    formula: "\\Delta L = \\alpha L_0 \\Delta T",
    explanation: "Calculates the change in length of a solid due to temperature change.",
    variables: [
      { symbol: "\\alpha", meaning: "coefficient of linear expansion" },
      { symbol: "L_0", meaning: "original length" },
      { symbol: "\\Delta T", meaning: "temperature change" },
    ],
    example: "Find ΔL for α=12×10⁻⁶/°C, L0=2m, ΔT=50°C",
  },

  // =========================
  // CHEMISTRY — Organic & Redox
  // =========================
  {
    id: 518,
    title: "General Formula for Alkanes",
    subject: "Chemistry",
    category: "Organic Chemistry",
    level: "Foundational",
    formula: "C_nH_{2n+2}",
    explanation: "General molecular formula for saturated hydrocarbons (alkanes).",
    variables: [
      { symbol: "n", meaning: "number of carbon atoms" },
    ],
    example: "Find formula for an alkane with 5 carbons",
  },
  {
    id: 519,
    title: "General Formula for Alkenes",
    subject: "Chemistry",
    category: "Organic Chemistry",
    level: "Foundational",
    formula: "C_nH_{2n}",
    explanation: "General molecular formula for alkenes (one double bond).",
    variables: [
      { symbol: "n", meaning: "number of carbon atoms" },
    ],
    example: "Find formula for an alkene with 4 carbons",
  },
  {
    id: 520,
    title: "General Formula for Alkynes",
    subject: "Chemistry",
    category: "Organic Chemistry",
    level: "Foundational",
    formula: "C_nH_{2n-2}",
    explanation: "General molecular formula for alkynes (one triple bond).",
    variables: [
      { symbol: "n", meaning: "number of carbon atoms" },
    ],
    example: "Find formula for an alkyne with 3 carbons",
  },
  {
    id: 521,
    title: "Oxidation Number Rule (Neutral Compound)",
    subject: "Chemistry",
    category: "Redox Reactions",
    level: "Foundational",
    formula: "\\sum \\text{Oxidation Numbers} = 0",
    explanation: "The sum of oxidation numbers in a neutral compound equals zero.",
    variables: [
      { symbol: "Oxidation Numbers", meaning: "charges assigned to each atom" },
    ],
    example: "Find oxidation number of S in H2SO4",
  },
  {
    id: 522,
    title: "Standard Cell Potential",
    subject: "Chemistry",
    category: "Electrochemistry",
    level: "University",
    formula: "E^\\circ_{cell} = E^\\circ_{cathode} - E^\\circ_{anode}",
    explanation: "Calculates the standard EMF of an electrochemical cell.",
    variables: [
      { symbol: "E^\\circ_{cathode}", meaning: "standard reduction potential of cathode" },
      { symbol: "E^\\circ_{anode}", meaning: "standard reduction potential of anode" },
    ],
    example: "Find E°cell for a Zn-Cu galvanic cell",
  },
  {
    id: 523,
    title: "Relationship Between Gibbs Energy and Cell Potential",
    subject: "Chemistry",
    category: "Electrochemistry",
    level: "University",
    formula: "\\Delta G = -nFE",
    explanation: "Relates Gibbs free energy change to cell potential.",
    variables: [
      { symbol: "n", meaning: "moles of electrons transferred" },
      { symbol: "F", meaning: "Faraday's constant" },
      { symbol: "E", meaning: "cell potential" },
    ],
    example: "Find ΔG for n=2, E=1.1V",
  },
  {
    id: 524,
    title: "Boiling Point Elevation",
    subject: "Chemistry",
    category: "Colligative Properties",
    level: "University",
    formula: "\\Delta T_b = K_b m",
    explanation: "Calculates the rise in boiling point due to dissolved solute.",
    variables: [
      { symbol: "K_b", meaning: "ebullioscopic constant" },
      { symbol: "m", meaning: "molality of solution" },
    ],
    example: "Find ΔTb for Kb=0.512°C/m, m=2mol/kg",
  },
  {
    id: 525,
    title: "Freezing Point Depression",
    subject: "Chemistry",
    category: "Colligative Properties",
    level: "University",
    formula: "\\Delta T_f = K_f m",
    explanation: "Calculates the drop in freezing point due to dissolved solute.",
    variables: [
      { symbol: "K_f", meaning: "cryoscopic constant" },
      { symbol: "m", meaning: "molality of solution" },
    ],
    example: "Find ΔTf for Kf=1.86°C/m, m=1mol/kg",
  },
  {
    id: 526,
    title: "Osmotic Pressure",
    subject: "Chemistry",
    category: "Colligative Properties",
    level: "University",
    formula: "\\Pi = MRT",
    explanation: "Calculates the osmotic pressure of a solution.",
    variables: [
      { symbol: "M", meaning: "molarity" },
      { symbol: "R", meaning: "gas constant" },
      { symbol: "T", meaning: "temperature (K)" },
    ],
    example: "Find Π for M=0.1mol/L, T=298K",
  },

  // =========================
  // BIOLOGY — Genetics, Ecology, Physiology
  // =========================
  {
    id: 527,
    title: "Punnett Square Ratio (Monohybrid Cross)",
    subject: "Biology",
    category: "Genetics",
    level: "Foundational",
    formula: "3:1 \\text{ (dominant:recessive)}",
    explanation: "Expected phenotypic ratio from a monohybrid cross of heterozygotes.",
    variables: [
      { symbol: "3:1", meaning: "ratio of dominant to recessive phenotypes" },
    ],
    example: "Predict offspring ratio for Aa × Aa cross",
  },
  {
    id: 528,
    title: "Dihybrid Cross Ratio",
    subject: "Biology",
    category: "Genetics",
    level: "University",
    formula: "9:3:3:1",
    explanation: "Expected phenotypic ratio from a dihybrid cross of heterozygotes.",
    variables: [
      { symbol: "9:3:3:1", meaning: "ratio of the four possible phenotype combinations" },
    ],
    example: "Predict offspring ratio for AaBb × AaBb cross",
  },
  {
    id: 529,
    title: "Ecological Efficiency (Energy Transfer)",
    subject: "Biology",
    category: "Ecology",
    level: "University",
    formula: "\\%Efficiency = \\frac{\\text{Energy at trophic level } n+1}{\\text{Energy at trophic level } n}\\times 100",
    explanation: "Measures the percentage of energy transferred between trophic levels.",
    variables: [
      { symbol: "Energy at trophic level n", meaning: "energy available at a given level" },
    ],
    example: "Find efficiency when 10,000J transfers to 1,000J",
  },
  {
    id: 530,
    title: "Rate of Transpiration",
    subject: "Biology",
    category: "Plant Physiology",
    level: "University",
    formula: "\\text{Rate} = \\frac{\\text{Volume of water lost}}{\\text{Time}}",
    explanation: "Measures the rate of water loss from a plant via transpiration.",
    variables: [
      { symbol: "Volume of water lost", meaning: "water lost by the plant" },
      { symbol: "Time", meaning: "duration of measurement" },
    ],
    example: "Find rate for 5cm³ lost over 10 minutes",
  },
  {
    id: 531,
    title: "Photosynthesis Rate (Gas Evolved)",
    subject: "Biology",
    category: "Plant Physiology",
    level: "University",
    formula: "\\text{Rate} = \\frac{\\text{Volume of O}_2\\text{ evolved}}{\\text{Time}}",
    explanation: "Measures the rate of photosynthesis via oxygen production.",
    variables: [
      { symbol: "Volume of O2 evolved", meaning: "oxygen gas released" },
      { symbol: "Time", meaning: "duration of measurement" },
    ],
    example: "Find rate for 15cm³ O2 evolved in 5 minutes",
  },
  {
    id: 532,
    title: "Water Potential",
    subject: "Biology",
    category: "Plant Physiology",
    level: "University",
    formula: "\\Psi = \\Psi_p + \\Psi_s",
    explanation: "Determines the direction of water movement across a membrane.",
    variables: [
      { symbol: "\\Psi_p", meaning: "pressure potential" },
      { symbol: "\\Psi_s", meaning: "solute potential" },
    ],
    example: "Find water potential given pressure and solute potentials",
  },

  // =========================
  // ECONOMICS — Macroeconomics & Trade
  // =========================
  {
    id: 533,
    title: "National Income (Income Approach)",
    subject: "Economics",
    category: "Macroeconomics",
    level: "University",
    formula: "NI = W + R + I + P",
    explanation: "Calculates national income by summing factor incomes.",
    variables: [
      { symbol: "W", meaning: "wages" },
      { symbol: "R", meaning: "rent" },
      { symbol: "I", meaning: "interest" },
      { symbol: "P", meaning: "profit" },
    ],
    example: "Find NI given wages, rent, interest, and profit",
  },
  {
    id: 534,
    title: "Inflation Rate",
    subject: "Economics",
    category: "Macroeconomics",
    level: "Foundational",
    formula: "\\text{Inflation Rate} = \\frac{CPI_2 - CPI_1}{CPI_1}\\times 100",
    explanation: "Measures the percentage change in the price level over time.",
    variables: [
      { symbol: "CPI_1,CPI_2", meaning: "consumer price index at two time periods" },
    ],
    example: "Find inflation rate for CPI1=120, CPI2=132",
  },
  {
    id: 535,
    title: "Balance of Payments",
    subject: "Economics",
    category: "International Trade",
    level: "University",
    formula: "BOP = \\text{Current Account} + \\text{Capital Account}",
    explanation: "Records all economic transactions between a country and the rest of the world.",
    variables: [
      { symbol: "Current Account", meaning: "trade in goods, services, and income" },
      { symbol: "Capital Account", meaning: "capital transfers and investment flows" },
    ],
    example: "Find BOP given current and capital account values",
  },
  {
    id: 536,
    title: "Terms of Trade",
    subject: "Economics",
    category: "International Trade",
    level: "University",
    formula: "TOT = \\frac{\\text{Export Price Index}}{\\text{Import Price Index}}\\times 100",
    explanation: "Measures the rate of exchange of exports for imports.",
    variables: [
      { symbol: "Export Price Index", meaning: "average price index of exports" },
      { symbol: "Import Price Index", meaning: "average price index of imports" },
    ],
    example: "Find TOT for export index=110, import index=100",
  },
  {
    id: 537,
    title: "Average Propensity to Consume",
    subject: "Economics",
    category: "Macroeconomics",
    level: "University",
    formula: "APC = \\frac{C}{Y}",
    explanation: "Measures the proportion of total income spent on consumption.",
    variables: [
      { symbol: "C", meaning: "total consumption" },
      { symbol: "Y", meaning: "total income" },
    ],
    example: "Find APC for C=₦80,000, Y=₦100,000",
  },
  {
    id: 538,
    title: "Unemployment Rate",
    subject: "Economics",
    category: "Macroeconomics",
    level: "Foundational",
    formula: "\\text{Unemployment Rate} = \\frac{\\text{Number Unemployed}}{\\text{Labor Force}}\\times 100",
    explanation: "Measures the percentage of the labor force that is jobless.",
    variables: [
      { symbol: "Number Unemployed", meaning: "people actively seeking work but jobless" },
      { symbol: "Labor Force", meaning: "total employed plus unemployed" },
    ],
    example: "Find unemployment rate for 2,000,000 unemployed in a 20,000,000 labor force",
  },

  // =========================
  // ACCOUNTING — More Ratios & Partnership
  // =========================
  {
    id: 539,
    title: "Gross Profit Margin",
    subject: "Accounting",
    category: "Financial Ratios",
    level: "Foundational",
    formula: "GPM = \\frac{\\text{Gross Profit}}{\\text{Sales}}\\times 100",
    explanation: "Measures gross profit as a percentage of sales.",
    variables: [
      { symbol: "Gross Profit", meaning: "sales minus cost of goods sold" },
      { symbol: "Sales", meaning: "total revenue from sales" },
    ],
    example: "Find GPM for gross profit=₦300,000, sales=₦1,000,000",
  },
  {
    id: 540,
    title: "Net Profit Margin",
    subject: "Accounting",
    category: "Financial Ratios",
    level: "Foundational",
    formula: "NPM = \\frac{\\text{Net Profit}}{\\text{Sales}}\\times 100",
    explanation: "Measures net profit as a percentage of sales.",
    variables: [
      { symbol: "Net Profit", meaning: "profit after all expenses" },
      { symbol: "Sales", meaning: "total revenue from sales" },
    ],
    example: "Find NPM for net profit=₦150,000, sales=₦1,000,000",
  },
  {
    id: 541,
    title: "Debtors Collection Period",
    subject: "Accounting",
    category: "Financial Ratios",
    level: "University",
    formula: "\\text{Collection Period} = \\frac{\\text{Debtors}}{\\text{Credit Sales}}\\times 365",
    explanation: "Measures the average number of days taken to collect debts.",
    variables: [
      { symbol: "Debtors", meaning: "amount owed by customers" },
      { symbol: "Credit Sales", meaning: "total sales made on credit" },
    ],
    example: "Find collection period for debtors=₦50,000, credit sales=₦600,000",
  },
  {
    id: 542,
    title: "Partnership Profit Sharing Ratio",
    subject: "Accounting",
    category: "Partnership Accounts",
    level: "University",
    formula: "\\text{Partner's Share} = \\text{Total Profit}\\times \\frac{\\text{Ratio Portion}}{\\text{Total Ratio}}",
    explanation: "Distributes partnership profit according to an agreed ratio.",
    variables: [
      { symbol: "Total Profit", meaning: "profit to be shared" },
      { symbol: "Ratio Portion", meaning: "individual partner's ratio" },
      { symbol: "Total Ratio", meaning: "sum of all partners' ratios" },
    ],
    example: "Share ₦300,000 profit between partners in ratio 2:1",
  },
  {
    id: 543,
    title: "Interest on Drawings",
    subject: "Accounting",
    category: "Partnership Accounts",
    level: "University",
    formula: "\\text{Interest} = \\text{Drawings}\\times \\text{Rate}\\times \\frac{\\text{Time}}{12}",
    explanation: "Calculates interest charged on a partner's drawings.",
    variables: [
      { symbol: "Drawings", meaning: "amount withdrawn by partner" },
      { symbol: "Rate", meaning: "agreed interest rate" },
      { symbol: "Time", meaning: "months since withdrawal" },
    ],
    example: "Find interest for drawings=₦20,000, rate=5%, time=6 months",
  },

  // =========================
  // STATISTICS — More
  // =========================
  {
    id: 544,
    title: "Median of Grouped Data",
    subject: "Statistics",
    category: "Measures of Central Tendency",
    level: "University",
    formula: "Median = L + \\left(\\frac{\\frac{N}{2}-CF}{f}\\right)h",
    explanation: "Finds the median of grouped frequency data.",
    variables: [
      { symbol: "L", meaning: "lower boundary of median class" },
      { symbol: "CF", meaning: "cumulative frequency before median class" },
      { symbol: "f", meaning: "frequency of median class" },
      { symbol: "h", meaning: "class width" },
    ],
    example: "Find median of a grouped frequency distribution",
  },
  {
    id: 545,
    title: "Mode of Grouped Data",
    subject: "Statistics",
    category: "Measures of Central Tendency",
    level: "University",
    formula: "Mode = L + \\left(\\frac{f_1-f_0}{2f_1-f_0-f_2}\\right)h",
    explanation: "Finds the mode of grouped frequency data.",
    variables: [
      { symbol: "L", meaning: "lower boundary of modal class" },
      { symbol: "f_1", meaning: "frequency of modal class" },
      { symbol: "f_0,f_2", meaning: "frequencies of classes before and after modal class" },
      { symbol: "h", meaning: "class width" },
    ],
    example: "Find mode of a grouped frequency distribution",
  },
  {
    id: 546,
    title: "Weighted Mean",
    subject: "Statistics",
    category: "Measures of Central Tendency",
    level: "Foundational",
    formula: "\\bar{x}_w = \\frac{\\sum w_ix_i}{\\sum w_i}",
    explanation: "Calculates the mean of values with different weights of importance.",
    variables: [
      { symbol: "w_i", meaning: "weight of each value" },
      { symbol: "x_i", meaning: "each data value" },
    ],
    example: "Find weighted mean of exam scores with different credit units",
  },
  {
    id: 547,
    title: "Price Index Number (Laspeyres)",
    subject: "Statistics",
    category: "Index Numbers",
    level: "University",
    formula: "P_L = \\frac{\\sum P_1Q_0}{\\sum P_0Q_0}\\times 100",
    explanation: "Measures price changes using base-year quantities as weights.",
    variables: [
      { symbol: "P_0,P_1", meaning: "base and current year prices" },
      { symbol: "Q_0", meaning: "base year quantity" },
    ],
    example: "Compute Laspeyres price index for a basket of goods",
  },

  // =========================
  // AGRICULTURAL SCIENCE — More
  // =========================
  {
    id: 548,
    title: "Percentage Dry Matter",
    subject: "Agricultural Science",
    category: "Animal Nutrition",
    level: "Foundational",
    formula: "\\%DM = \\frac{\\text{Weight after drying}}{\\text{Fresh weight}}\\times 100",
    explanation: "Measures the proportion of dry matter in a feed sample.",
    variables: [
      { symbol: "Weight after drying", meaning: "sample mass after removing moisture" },
      { symbol: "Fresh weight", meaning: "original sample mass" },
    ],
    example: "Find %DM for 20g dry weight from 100g fresh sample",
  },
  {
    id: 549,
    title: "Crop Yield per Hectare",
    subject: "Agricultural Science",
    category: "Crop Production",
    level: "Foundational",
    formula: "\\text{Yield} = \\frac{\\text{Total Produce}}{\\text{Land Area (ha)}}",
    explanation: "Measures crop output per unit area of farmland.",
    variables: [
      { symbol: "Total Produce", meaning: "total harvest quantity" },
      { symbol: "Land Area", meaning: "farm size in hectares" },
    ],
    example: "Find yield for 5,000kg maize on 2 hectares",
  },
  {
    id: 550,
    title: "Percentage Concentrate in Ration",
    subject: "Agricultural Science",
    category: "Animal Nutrition",
    level: "University",
    formula: "\\%Concentrate = \\frac{\\text{Mass of concentrate}}{\\text{Total ration mass}}\\times 100",
    explanation: "Measures the proportion of concentrate feed in a livestock ration.",
    variables: [
      { symbol: "Mass of concentrate", meaning: "amount of concentrate feed" },
      { symbol: "Total ration mass", meaning: "total feed mixture mass" },
    ],
    example: "Find % concentrate for 5kg concentrate in a 20kg ration",
  },

  // =========================
  // COMPUTER SCIENCE — More
  // =========================
  {
    id: 551,
    title: "Boolean OR Law",
    subject: "Computer Science",
    category: "Boolean Algebra",
    level: "Foundational",
    formula: "A + 1 = 1, \\quad A + 0 = A",
    explanation: "Identity and null laws for the OR operation in Boolean algebra.",
    variables: [
      { symbol: "A", meaning: "Boolean variable" },
    ],
    example: "Simplify A+1 and A+0",
  },
  {
    id: 552,
    title: "Big O Complexity (Quadratic)",
    subject: "Computer Science",
    category: "Algorithms",
    level: "University",
    formula: "O(n^2)",
    explanation: "Describes an algorithm whose running time grows with the square of input size.",
    variables: [
      { symbol: "n", meaning: "size of input" },
    ],
    example: "Analyze time complexity of nested loops over an array",
  },
  {
    id: 553,
    title: "Number of Subnets Formula",
    subject: "Computer Science",
    category: "Networking",
    level: "University",
    formula: "\\text{Subnets} = 2^s",
    explanation: "Calculates the number of subnets created from borrowed host bits.",
    variables: [
      { symbol: "s", meaning: "number of borrowed subnet bits" },
    ],
    example: "Find number of subnets when 3 bits are borrowed",
  },
  {
    id: 554,
    title: "Number of Usable Hosts per Subnet",
    subject: "Computer Science",
    category: "Networking",
    level: "University",
    formula: "\\text{Hosts} = 2^h - 2",
    explanation: "Calculates the number of usable IP addresses in a subnet.",
    variables: [
      { symbol: "h", meaning: "number of host bits" },
    ],
    example: "Find usable hosts for a /24 subnet",
  },

  // =========================
  // GEOGRAPHY — More
  // =========================
  {
    id: 555,
    title: "Vertical Exaggeration (Cross-Sections)",
    subject: "Geography",
    category: "Map Reading",
    level: "University",
    formula: "VE = \\frac{\\text{Vertical Scale}}{\\text{Horizontal Scale}}",
    explanation: "Measures how much the vertical scale of a cross-section is exaggerated relative to the horizontal scale.",
    variables: [
      { symbol: "Vertical Scale", meaning: "scale used for elevation" },
      { symbol: "Horizontal Scale", meaning: "scale used for distance" },
    ],
    example: "Find VE for vertical scale 1:1000, horizontal scale 1:50000",
  },
  {
    id: 556,
    title: "Annual Range of Temperature",
    subject: "Geography",
    category: "Climatology",
    level: "Foundational",
    formula: "\\text{Range} = T_{max} - T_{min}",
    explanation: "Measures the difference between the highest and lowest monthly mean temperatures.",
    variables: [
      { symbol: "T_{max}", meaning: "highest mean monthly temperature" },
      { symbol: "T_{min}", meaning: "lowest mean monthly temperature" },
    ],
    example: "Find range for Tmax=30°C, Tmin=18°C",
  },
  {
    id: 557,
    title: "Rate of Population Increase (Doubling Time)",
    subject: "Geography",
    category: "Population Geography",
    level: "University",
    formula: "\\text{Doubling Time} = \\frac{70}{\\text{Growth Rate \\%}}",
    explanation: "Estimates the number of years for a population to double.",
    variables: [
      { symbol: "Growth Rate \\%", meaning: "annual percentage growth rate" },
    ],
    example: "Find doubling time for a 2% annual growth rate",
  },

  // =========================
  // FINANCIAL MATHEMATICS
  // =========================
  {
    id: 558,
    title: "Future Value of an Annuity",
    subject: "Mathematics",
    category: "Financial Maths",
    level: "University",
    formula: "FV = P\\times\\frac{(1+r)^n - 1}{r}",
    explanation: "Calculates the future value of a series of equal periodic payments.",
    variables: [
      { symbol: "P", meaning: "periodic payment" },
      { symbol: "r", meaning: "interest rate per period" },
      { symbol: "n", meaning: "number of periods" },
    ],
    example: "Find FV for P=₦10,000, r=5%, n=10 years",
  },
  {
    id: 559,
    title: "Present Value of an Annuity",
    subject: "Mathematics",
    category: "Financial Maths",
    level: "University",
    formula: "PV = P\\times\\frac{1-(1+r)^{-n}}{r}",
    explanation: "Calculates the present value of a series of equal periodic payments.",
    variables: [
      { symbol: "P", meaning: "periodic payment" },
      { symbol: "r", meaning: "interest rate per period" },
      { symbol: "n", meaning: "number of periods" },
    ],
    example: "Find PV for P=₦5,000, r=6%, n=5 years",
  },
  {
    id: 560,
    title: "Amortization Payment Formula",
    subject: "Mathematics",
    category: "Financial Maths",
    level: "University",
    formula: "A = \\frac{Pr(1+r)^n}{(1+r)^n - 1}",
    explanation: "Calculates the fixed periodic payment to repay a loan.",
    variables: [
      { symbol: "P", meaning: "loan principal" },
      { symbol: "r", meaning: "interest rate per period" },
      { symbol: "n", meaning: "number of payment periods" },
    ],
    example: "Find monthly payment for a loan of ₦1,000,000 at 1% monthly over 24 months",
  },
  {
    id: 561,
    title: "Continuous Compound Interest",
    subject: "Mathematics",
    category: "Financial Maths",
    level: "University",
    formula: "A = Pe^{rt}",
    explanation: "Calculates compound interest when compounding occurs continuously.",
    variables: [
      { symbol: "P", meaning: "principal" },
      { symbol: "r", meaning: "annual interest rate" },
      { symbol: "t", meaning: "time in years" },
    ],
    example: "Find A for P=₦10,000, r=5%, t=3 years",
  },
  // =========================
  // PHYSICS — Gravitation
  // =========================
  {
    id: 562,
    title: "Newton's Law of Universal Gravitation",
    subject: "Physics",
    category: "Gravitation",
    level: "University",
    formula: "F = \\frac{Gm_1m_2}{r^2}",
    explanation: "Calculates the gravitational force between two masses.",
    variables: [
      { symbol: "G", meaning: "gravitational constant" },
      { symbol: "m_1,m_2", meaning: "masses of the two bodies" },
      { symbol: "r", meaning: "distance between their centers" },
    ],
    example: "Find gravitational force between Earth and Moon",
  },
  {
    id: 563,
    title: "Escape Velocity",
    subject: "Physics",
    category: "Gravitation",
    level: "University",
    formula: "v_e = \\sqrt{\\frac{2GM}{R}}",
    explanation: "Calculates the minimum speed needed to escape a planet's gravity.",
    variables: [
      { symbol: "G", meaning: "gravitational constant" },
      { symbol: "M", meaning: "mass of the planet" },
      { symbol: "R", meaning: "radius of the planet" },
    ],
    example: "Find escape velocity from Earth's surface",
  },
  {
    id: 564,
    title: "Kepler's Third Law",
    subject: "Physics",
    category: "Gravitation",
    level: "University",
    formula: "T^2 \\propto r^3",
    explanation: "Relates the orbital period of a planet to its distance from the sun.",
    variables: [
      { symbol: "T", meaning: "orbital period" },
      { symbol: "r", meaning: "orbital radius" },
    ],
    example: "Compare orbital periods of two planets at different distances",
  },
  {
    id: 565,
    title: "Gravitational Field Strength",
    subject: "Physics",
    category: "Gravitation",
    level: "University",
    formula: "g = \\frac{GM}{r^2}",
    explanation: "Calculates the gravitational field strength at a distance from a mass.",
    variables: [
      { symbol: "G", meaning: "gravitational constant" },
      { symbol: "M", meaning: "mass of the body" },
      { symbol: "r", meaning: "distance from the center of mass" },
    ],
    example: "Find g at the Earth's surface",
  },
  {
    id: 566,
    title: "Orbital Velocity",
    subject: "Physics",
    category: "Gravitation",
    level: "University",
    formula: "v_o = \\sqrt{\\frac{GM}{r}}",
    explanation: "Calculates the speed needed to maintain a circular orbit.",
    variables: [
      { symbol: "G", meaning: "gravitational constant" },
      { symbol: "M", meaning: "mass of the central body" },
      { symbol: "r", meaning: "orbital radius" },
    ],
    example: "Find orbital velocity of a satellite 400km above Earth",
  },

  // =========================
  // PHYSICS — Waves (advanced)
  // =========================
  {
    id: 567,
    title: "Diffraction Grating Equation",
    subject: "Physics",
    category: "Waves",
    level: "University",
    formula: "d\\sin\\theta = n\\lambda",
    explanation: "Relates the angle of diffraction to wavelength and grating spacing.",
    variables: [
      { symbol: "d", meaning: "grating spacing" },
      { symbol: "\\theta", meaning: "angle of diffraction" },
      { symbol: "n", meaning: "order of the fringe" },
      { symbol: "\\lambda", meaning: "wavelength" },
    ],
    example: "Find λ given d, θ, and n=1",
  },
  {
    id: 568,
    title: "Young's Double Slit Fringe Spacing",
    subject: "Physics",
    category: "Waves",
    level: "University",
    formula: "y = \\frac{\\lambda D}{a}",
    explanation: "Calculates the spacing between bright fringes in a double-slit experiment.",
    variables: [
      { symbol: "\\lambda", meaning: "wavelength of light" },
      { symbol: "D", meaning: "distance from slits to screen" },
      { symbol: "a", meaning: "slit separation" },
    ],
    example: "Find fringe spacing for λ=600nm, D=2m, a=0.5mm",
  },
  {
    id: 569,
    title: "Beat Frequency",
    subject: "Physics",
    category: "Waves",
    level: "University",
    formula: "f_{beat} = |f_1 - f_2|",
    explanation: "Calculates the frequency of beats produced by two close frequencies.",
    variables: [
      { symbol: "f_1,f_2", meaning: "frequencies of the two waves" },
    ],
    example: "Find beat frequency for f1=440Hz, f2=442Hz",
  },
  {
    id: 570,
    title: "Fundamental Frequency of a Stretched String",
    subject: "Physics",
    category: "Waves",
    level: "University",
    formula: "f_0 = \\frac{1}{2L}\\sqrt{\\frac{T}{\\mu}}",
    explanation: "Calculates the fundamental frequency of vibration of a string.",
    variables: [
      { symbol: "L", meaning: "length of string" },
      { symbol: "T", meaning: "tension in the string" },
      { symbol: "\\mu", meaning: "mass per unit length" },
    ],
    example: "Find fundamental frequency of a guitar string",
  },
  {
    id: 571,
    title: "Closed Pipe Resonant Frequency",
    subject: "Physics",
    category: "Waves",
    level: "University",
    formula: "f_n = \\frac{nv}{4L}, \\quad n = 1,3,5...",
    explanation: "Calculates resonant frequencies in a pipe closed at one end.",
    variables: [
      { symbol: "v", meaning: "speed of sound" },
      { symbol: "L", meaning: "length of pipe" },
      { symbol: "n", meaning: "harmonic number (odd only)" },
    ],
    example: "Find fundamental frequency of a 0.5m closed pipe",
  },

  // =========================
  // CHEMISTRY — Atomic Structure & Periodic Trends
  // =========================
  {
    id: 572,
    title: "Number of Neutrons",
    subject: "Chemistry",
    category: "Atomic Structure",
    level: "Foundational",
    formula: "N = A - Z",
    explanation: "Calculates the number of neutrons in an atom.",
    variables: [
      { symbol: "A", meaning: "mass number" },
      { symbol: "Z", meaning: "atomic number" },
    ],
    example: "Find neutrons in an atom with A=23, Z=11",
  },
  {
    id: 573,
    title: "Bohr's Model Energy Levels",
    subject: "Chemistry",
    category: "Atomic Structure",
    level: "University",
    formula: "E_n = -\\frac{13.6}{n^2}\\text{ eV}",
    explanation: "Calculates the energy of an electron in a given orbit of hydrogen.",
    variables: [
      { symbol: "n", meaning: "principal quantum number" },
    ],
    example: "Find energy of electron in n=2 orbit",
  },
  {
    id: 574,
    title: "Average Atomic Mass",
    subject: "Chemistry",
    category: "Atomic Structure",
    level: "Foundational",
    formula: "\\bar{M} = \\sum (\\text{isotope mass}\\times \\text{fractional abundance})",
    explanation: "Calculates the weighted average mass of an element's isotopes.",
    variables: [
      { symbol: "isotope mass", meaning: "mass of each isotope" },
      { symbol: "fractional abundance", meaning: "relative abundance of each isotope" },
    ],
    example: "Find average atomic mass of chlorine from its two isotopes",
  },
  {
    id: 575,
    title: "Rate of Diffusion and Molar Mass",
    subject: "Chemistry",
    category: "Gas Laws",
    level: "University",
    formula: "r \\propto \\frac{1}{\\sqrt{M}}",
    explanation: "States that rate of gas diffusion is inversely proportional to the square root of molar mass.",
    variables: [
      { symbol: "r", meaning: "rate of diffusion" },
      { symbol: "M", meaning: "molar mass" },
    ],
    example: "Compare diffusion rates of two gases with different molar masses",
  },
  {
    id: 576,
    title: "Percentage Composition by Mass",
    subject: "Chemistry",
    category: "Stoichiometry",
    level: "Foundational",
    formula: "\\%Composition = \\frac{\\text{Mass of element in compound}}{\\text{Molar mass of compound}}\\times 100",
    explanation: "Calculates the percentage by mass of an element in a compound.",
    variables: [
      { symbol: "Mass of element", meaning: "total mass contributed by the element" },
      { symbol: "Molar mass of compound", meaning: "total molar mass of the compound" },
    ],
    example: "Find % composition of oxygen in CO2",
  },

  // =========================
  // BIOLOGY — Respiration, Excretion, Nervous System
  // =========================
  {
    id: 577,
    title: "Respiratory Quotient",
    subject: "Biology",
    category: "Respiration",
    level: "University",
    formula: "RQ = \\frac{\\text{Volume of CO}_2\\text{ produced}}{\\text{Volume of O}_2\\text{ consumed}}",
    explanation: "Indicates the type of substrate being respired.",
    variables: [
      { symbol: "Volume of CO2 produced", meaning: "carbon dioxide released" },
      { symbol: "Volume of O2 consumed", meaning: "oxygen used" },
    ],
    example: "Find RQ for 20cm³ CO2 and 20cm³ O2",
  },
  {
    id: 578,
    title: "Glomerular Filtration Rate",
    subject: "Biology",
    category: "Excretion",
    level: "University",
    formula: "GFR = \\frac{U \\times V}{P}",
    explanation: "Estimates the rate of blood filtration by the kidneys.",
    variables: [
      { symbol: "U", meaning: "concentration of substance in urine" },
      { symbol: "V", meaning: "urine flow rate" },
      { symbol: "P", meaning: "concentration of substance in plasma" },
    ],
    example: "Find GFR given urine and plasma creatinine values",
  },
  {
    id: 579,
    title: "Nerve Impulse Speed",
    subject: "Biology",
    category: "Nervous System",
    level: "University",
    formula: "\\text{Speed} = \\frac{\\text{Distance}}{\\text{Time}}",
    explanation: "Calculates the speed of transmission of a nerve impulse along an axon.",
    variables: [
      { symbol: "Distance", meaning: "length of nerve fiber" },
      { symbol: "Time", meaning: "time taken for the impulse to travel" },
    ],
    example: "Find speed for a 1m nerve fiber with 10ms transmission time",
  },
  {
    id: 580,
    title: "Cardiac Output",
    subject: "Biology",
    category: "Circulatory System",
    level: "University",
    formula: "CO = SV \\times HR",
    explanation: "Calculates the volume of blood pumped by the heart per minute.",
    variables: [
      { symbol: "SV", meaning: "stroke volume" },
      { symbol: "HR", meaning: "heart rate" },
    ],
    example: "Find cardiac output for SV=70mL, HR=72bpm",
  },
  {
    id: 581,
    title: "Vital Capacity",
    subject: "Biology",
    category: "Respiratory System",
    level: "University",
    formula: "VC = TV + IRV + ERV",
    explanation: "Calculates the maximum amount of air a person can expel after full inhalation.",
    variables: [
      { symbol: "TV", meaning: "tidal volume" },
      { symbol: "IRV", meaning: "inspiratory reserve volume" },
      { symbol: "ERV", meaning: "expiratory reserve volume" },
    ],
    example: "Find VC given TV, IRV, and ERV values",
  },

  // =========================
  // MATHEMATICS — Functions, Inequalities, Locus
  // =========================
  {
    id: 582,
    title: "Composite Function",
    subject: "Mathematics",
    category: "Functions",
    level: "Foundational",
    formula: "(f\\circ g)(x) = f(g(x))",
    explanation: "Combines two functions by applying one to the result of the other.",
    variables: [
      { symbol: "f,g", meaning: "the two functions being composed" },
    ],
    example: "Find (f∘g)(x) for f(x)=2x+1, g(x)=x²",
  },
  {
    id: 583,
    title: "Inverse Function Condition",
    subject: "Mathematics",
    category: "Functions",
    level: "Foundational",
    formula: "f(f^{-1}(x)) = x",
    explanation: "Defines the relationship between a function and its inverse.",
    variables: [
      { symbol: "f", meaning: "original function" },
      { symbol: "f^{-1}", meaning: "inverse function" },
    ],
    example: "Find f⁻¹(x) for f(x)=3x-2",
  },
  {
    id: 584,
    title: "Linear Inequality Solution Form",
    subject: "Mathematics",
    category: "Inequalities",
    level: "Foundational",
    formula: "ax + b > c \\implies x > \\frac{c-b}{a}",
    explanation: "Solves a linear inequality for x.",
    variables: [
      { symbol: "a,b,c", meaning: "constants in the inequality" },
    ],
    example: "Solve 2x+3>7",
  },
  {
    id: 585,
    title: "Locus of a Circle",
    subject: "Mathematics",
    category: "Locus",
    level: "Foundational",
    formula: "(x-a)^2 + (y-b)^2 = r^2",
    explanation: "Defines the locus of points equidistant from a fixed center.",
    variables: [
      { symbol: "a,b", meaning: "coordinates of the center" },
      { symbol: "r", meaning: "radius" },
    ],
    example: "Find equation of circle with center (2,3), radius 5",
  },
  {
    id: 586,
    title: "Perpendicular Bisector Locus",
    subject: "Mathematics",
    category: "Locus",
    level: "Foundational",
    formula: "\\text{Locus: set of points equidistant from A and B}",
    explanation: "Describes the locus of points equidistant from two fixed points.",
    variables: [
      { symbol: "A,B", meaning: "the two fixed points" },
    ],
    example: "Find locus of points equidistant from A(0,0) and B(4,0)",
  },
  {
    id: 587,
    title: "Sum of Interior Angles of a Polygon",
    subject: "Mathematics",
    category: "Geometry",
    level: "Foundational",
    formula: "S = (n-2)\\times 180°",
    explanation: "Calculates the sum of interior angles of a polygon.",
    variables: [
      { symbol: "n", meaning: "number of sides" },
    ],
    example: "Find sum of interior angles of a hexagon",
  },
  {
    id: 588,
    title: "Each Interior Angle of a Regular Polygon",
    subject: "Mathematics",
    category: "Geometry",
    level: "Foundational",
    formula: "\\theta = \\frac{(n-2)\\times 180°}{n}",
    explanation: "Calculates the size of each interior angle of a regular polygon.",
    variables: [
      { symbol: "n", meaning: "number of sides" },
    ],
    example: "Find each interior angle of a regular pentagon",
  },
  {
    id: 589,
    title: "Sum of Exterior Angles of a Polygon",
    subject: "Mathematics",
    category: "Geometry",
    level: "Foundational",
    formula: "S = 360°",
    explanation: "States that exterior angles of any convex polygon sum to 360°.",
    variables: [
      { symbol: "S", meaning: "sum of exterior angles" },
    ],
    example: "Confirm exterior angle sum for an octagon",
  },

  // =========================
  // FURTHER MATHEMATICS — Vectors 3D & Groups
  // =========================
  {
    id: 590,
    title: "Angle Between Two Vectors",
    subject: "Further Mathematics",
    category: "Vectors",
    level: "University",
    formula: "\\cos\\theta = \\frac{\\vec{a}\\cdot\\vec{b}}{|\\vec{a}||\\vec{b}|}",
    explanation: "Calculates the angle between two vectors using the dot product.",
    variables: [
      { symbol: "\\vec{a},\\vec{b}", meaning: "the two vectors" },
    ],
    example: "Find angle between (1,2,3) and (4,5,6)",
  },
  {
    id: 591,
    title: "Vector Equation of a Line",
    subject: "Further Mathematics",
    category: "Vectors",
    level: "University",
    formula: "\\vec{r} = \\vec{a} + t\\vec{b}",
    explanation: "Expresses the position vector of any point on a line.",
    variables: [
      { symbol: "\\vec{a}", meaning: "position vector of a known point" },
      { symbol: "\\vec{b}", meaning: "direction vector of the line" },
      { symbol: "t", meaning: "scalar parameter" },
    ],
    example: "Find vector equation of a line through (1,2,3) with direction (2,1,0)",
  },
  {
    id: 592,
    title: "Closure Property of a Group",
    subject: "Further Mathematics",
    category: "Group Theory",
    level: "University",
    formula: "a * b \\in G \\quad \\forall a,b \\in G",
    explanation: "States that the operation on any two group elements yields another group element.",
    variables: [
      { symbol: "G", meaning: "the group" },
      { symbol: "*", meaning: "the group operation" },
    ],
    example: "Verify closure for integers under addition",
  },
  {
    id: 593,
    title: "Identity Element of a Group",
    subject: "Further Mathematics",
    category: "Group Theory",
    level: "University",
    formula: "a * e = e * a = a",
    explanation: "Defines the identity element in a group under a given operation.",
    variables: [
      { symbol: "e", meaning: "identity element" },
      { symbol: "a", meaning: "any element of the group" },
    ],
    example: "Find identity element for integers under addition",
  },
  {
    id: 594,
    title: "Modular Arithmetic Congruence",
    subject: "Further Mathematics",
    category: "Number Theory",
    level: "University",
    formula: "a \\equiv b \\pmod{n}",
    explanation: "States that a and b have the same remainder when divided by n.",
    variables: [
      { symbol: "a,b", meaning: "integers being compared" },
      { symbol: "n", meaning: "modulus" },
    ],
    example: "Show 17 ≡ 2 (mod 5)",
  },

  // =========================
  // ENGINEERING — Civil, Electrical, Mechanical
  // =========================
  {
    id: 595,
    title: "Bending Moment of a Simply Supported Beam (Point Load)",
    subject: "Civil Engineering",
    category: "Structural Analysis",
    level: "University",
    formula: "M = \\frac{WL}{4}",
    explanation: "Calculates maximum bending moment for a central point load on a simply supported beam.",
    variables: [
      { symbol: "W", meaning: "point load" },
      { symbol: "L", meaning: "span of the beam" },
    ],
    example: "Find bending moment for W=10kN, L=4m",
  },
  {
    id: 596,
    title: "Shear Force at Support (Simply Supported Beam)",
    subject: "Civil Engineering",
    category: "Structural Analysis",
    level: "University",
    formula: "V = \\frac{W}{2}",
    explanation: "Calculates the shear force at supports for a central point load.",
    variables: [
      { symbol: "W", meaning: "point load" },
    ],
    example: "Find shear force for W=10kN",
  },
  {
    id: 597,
    title: "Concrete Mix Ratio Volume",
    subject: "Civil Engineering",
    category: "Materials",
    level: "University",
    formula: "V = \\frac{\\text{Parts of material}}{\\text{Total parts}}\\times \\text{Total volume}",
    explanation: "Calculates the volume of each material in a concrete mix.",
    variables: [
      { symbol: "Parts of material", meaning: "ratio portion for cement/sand/aggregate" },
      { symbol: "Total parts", meaning: "sum of all mix ratio parts" },
    ],
    example: "Find cement volume for a 1:2:4 mix and total volume of 7m³",
  },
  {
    id: 598,
    title: "Three-Phase Power",
    subject: "Electrical Engineering",
    category: "Power Systems",
    level: "University",
    formula: "P = \\sqrt{3}V_LI_L\\cos\\phi",
    explanation: "Calculates real power in a balanced three-phase circuit.",
    variables: [
      { symbol: "V_L", meaning: "line voltage" },
      { symbol: "I_L", meaning: "line current" },
      { symbol: "\\cos\\phi", meaning: "power factor" },
    ],
    example: "Find power for VL=400V, IL=10A, cosφ=0.8",
  },
  {
    id: 599,
    title: "Power Factor",
    subject: "Electrical Engineering",
    category: "AC Circuits",
    level: "University",
    formula: "pf = \\cos\\phi = \\frac{P}{S}",
    explanation: "Measures how effectively electrical power is being used.",
    variables: [
      { symbol: "P", meaning: "real power" },
      { symbol: "S", meaning: "apparent power" },
    ],
    example: "Find power factor for P=800W, S=1000VA",
  },
  {
    id: 600,
    title: "Belt-Pulley Speed Ratio",
    subject: "Mechanical Engineering",
    category: "Machines",
    level: "University",
    formula: "\\frac{N_1}{N_2} = \\frac{D_2}{D_1}",
    explanation: "Relates rotational speeds and diameters of two connected pulleys.",
    variables: [
      { symbol: "N_1,N_2", meaning: "rotational speeds of pulleys 1 and 2" },
      { symbol: "D_1,D_2", meaning: "diameters of pulleys 1 and 2" },
    ],
    example: "Find N2 for N1=200rpm, D1=10cm, D2=20cm",
  },
  {
    id: 601,
    title: "Gear Ratio",
    subject: "Mechanical Engineering",
    category: "Machines",
    level: "University",
    formula: "GR = \\frac{\\text{Teeth on driven gear}}{\\text{Teeth on driving gear}}",
    explanation: "Calculates the mechanical advantage of a gear system.",
    variables: [
      { symbol: "Teeth on driven gear", meaning: "number of teeth on the output gear" },
      { symbol: "Teeth on driving gear", meaning: "number of teeth on the input gear" },
    ],
    example: "Find gear ratio for driven=40 teeth, driving=20 teeth",
  },

  // =========================
  // COMMERCE — More
  // =========================
  {
    id: 602,
    title: "Cash Discount",
    subject: "Commerce",
    category: "Trade",
    level: "Foundational",
    formula: "\\text{Cash Discount} = \\text{Invoice Amount}\\times \\text{Discount Rate}",
    explanation: "Calculates the discount given for prompt payment.",
    variables: [
      { symbol: "Invoice Amount", meaning: "total billed amount" },
      { symbol: "Discount Rate", meaning: "agreed discount percentage" },
    ],
    example: "Find cash discount for ₦50,000 invoice at 2% discount",
  },
  {
    id: 603,
    title: "Value Added Tax (VAT)",
    subject: "Commerce",
    category: "Taxation",
    level: "Foundational",
    formula: "VAT = \\text{Price}\\times \\text{VAT Rate}",
    explanation: "Calculates the tax added to the price of goods and services.",
    variables: [
      { symbol: "Price", meaning: "cost before tax" },
      { symbol: "VAT Rate", meaning: "government-set VAT percentage" },
    ],
    example: "Find VAT on ₦20,000 goods at 7.5% VAT rate",
  },
  {
    id: 604,
    title: "Commission on Sales",
    subject: "Commerce",
    category: "Trade",
    level: "Foundational",
    formula: "\\text{Commission} = \\text{Sales}\\times \\text{Commission Rate}",
    explanation: "Calculates the earnings of a sales agent based on total sales.",
    variables: [
      { symbol: "Sales", meaning: "total value of goods sold" },
      { symbol: "Commission Rate", meaning: "agreed percentage rate" },
    ],
    example: "Find commission for ₦500,000 sales at 5% rate",
  },

  // =========================
  // HEALTH / PHYSICAL EDUCATION
  // =========================
  {
    id: 605,
    title: "Maximum Heart Rate",
    subject: "Health Education",
    category: "Exercise Physiology",
    level: "Foundational",
    formula: "MHR = 220 - \\text{Age}",
    explanation: "Estimates the maximum heart rate for exercise intensity guidance.",
    variables: [
      { symbol: "Age", meaning: "person's age in years" },
    ],
    example: "Find MHR for a 20-year-old",
  },
  {
    id: 606,
    title: "Target Heart Rate Zone",
    subject: "Health Education",
    category: "Exercise Physiology",
    level: "University",
    formula: "THR = (MHR - RHR)\\times \\%Intensity + RHR",
    explanation: "Calculates the ideal heart rate range during exercise.",
    variables: [
      { symbol: "MHR", meaning: "maximum heart rate" },
      { symbol: "RHR", meaning: "resting heart rate" },
      { symbol: "\\%Intensity", meaning: "desired training intensity" },
    ],
    example: "Find THR for MHR=200, RHR=60, intensity=70%",
  },
  {
    id: 607,
    title: "Body Fat Percentage (Skinfold Estimate)",
    subject: "Health Education",
    category: "Fitness Assessment",
    level: "University",
    formula: "\\%BF = \\frac{\\text{Fat Mass}}{\\text{Total Body Mass}}\\times 100",
    explanation: "Estimates the proportion of body mass that is fat.",
    variables: [
      { symbol: "Fat Mass", meaning: "estimated mass of body fat" },
      { symbol: "Total Body Mass", meaning: "total body weight" },
    ],
    example: "Find %BF for fat mass=15kg, total mass=75kg",
  },

  // =========================
  // COMPUTER SCIENCE / ICT — More
  // =========================
  {
    id: 608,
    title: "Baud Rate Formula",
    subject: "Computer Science",
    category: "Networking",
    level: "University",
    formula: "\\text{Baud Rate} = \\frac{\\text{Bit Rate}}{\\text{Bits per Symbol}}",
    explanation: "Calculates the signaling rate of a data transmission system.",
    variables: [
      { symbol: "Bit Rate", meaning: "number of bits transmitted per second" },
      { symbol: "Bits per Symbol", meaning: "number of bits encoded per symbol" },
    ],
    example: "Find baud rate for bit rate=9600bps, 2 bits per symbol",
  },
  {
    id: 609,
    title: "File Compression Ratio",
    subject: "Computer Science",
    category: "Data Representation",
    level: "Foundational",
    formula: "CR = \\frac{\\text{Original Size}}{\\text{Compressed Size}}",
    explanation: "Measures how much a file has been reduced in size.",
    variables: [
      { symbol: "Original Size", meaning: "file size before compression" },
      { symbol: "Compressed Size", meaning: "file size after compression" },
    ],
    example: "Find compression ratio for 10MB reduced to 2MB",
  },
  {
    id: 610,
    title: "Boolean XOR Identity",
    subject: "Computer Science",
    category: "Boolean Algebra",
    level: "University",
    formula: "A \\oplus B = A\\bar{B} + \\bar{A}B",
    explanation: "Expresses the XOR operation in terms of AND, OR, and NOT.",
    variables: [
      { symbol: "A,B", meaning: "Boolean variables" },
    ],
    example: "Expand A⊕B using basic gates",
  },

  // =========================
  // GEOGRAPHY — More
  // =========================
  {
    id: 611,
    title: "Rate of Soil Erosion",
    subject: "Geography",
    category: "Geomorphology",
    level: "University",
    formula: "\\text{Erosion Rate} = \\frac{\\text{Soil Loss}}{\\text{Time}\\times \\text{Area}}",
    explanation: "Measures the rate at which soil is lost from an area over time.",
    variables: [
      { symbol: "Soil Loss", meaning: "mass of soil removed" },
      { symbol: "Time", meaning: "duration of measurement" },
      { symbol: "Area", meaning: "land area studied" },
    ],
    example: "Find erosion rate for 500kg soil lost over 1 year on 2 hectares",
  },
  {
    id: 612,
    title: "Relief of an Area",
    subject: "Geography",
    category: "Map Reading",
    level: "Foundational",
    formula: "\\text{Relief} = \\text{Highest Point} - \\text{Lowest Point}",
    explanation: "Measures the difference in elevation across an area.",
    variables: [
      { symbol: "Highest Point", meaning: "maximum elevation on the map" },
      { symbol: "Lowest Point", meaning: "minimum elevation on the map" },
    ],
    example: "Find relief for highest=850m, lowest=200m",
  },
  {
    id: 613,
    title: "Mean Annual Rainfall",
    subject: "Geography",
    category: "Climatology",
    level: "Foundational",
    formula: "\\bar{R} = \\frac{\\sum \\text{Monthly Rainfall}}{12}",
    explanation: "Calculates the average annual rainfall from monthly data.",
    variables: [
      { symbol: "Monthly Rainfall", meaning: "rainfall recorded each month" },
    ],
    example: "Find mean annual rainfall from 12 months of data",
  },

  // =========================
  // AGRICULTURAL ECONOMICS
  // =========================
  {
    id: 614,
    title: "Farm Profit",
    subject: "Agricultural Science",
    category: "Farm Management",
    level: "Foundational",
    formula: "\\text{Profit} = \\text{Total Revenue} - \\text{Total Cost}",
    explanation: "Calculates the net profit from farm operations.",
    variables: [
      { symbol: "Total Revenue", meaning: "income from farm produce sales" },
      { symbol: "Total Cost", meaning: "total cost of production" },
    ],
    example: "Find profit for revenue=₦800,000, cost=₦500,000",
  },
  {
    id: 615,
    title: "Gross Margin (Farm Management)",
    subject: "Agricultural Science",
    category: "Farm Management",
    level: "University",
    formula: "GM = \\text{Gross Output} - \\text{Variable Cost}",
    explanation: "Measures farm profitability before fixed costs are deducted.",
    variables: [
      { symbol: "Gross Output", meaning: "total value of farm produce" },
      { symbol: "Variable Cost", meaning: "costs that vary with production level" },
    ],
    example: "Find gross margin for output=₦600,000, variable cost=₦250,000",
  },
  {
    id: 616,
    title: "Sum of Geometric Progression",
    subject: "Mathematics",
    category: "Algebra",
    level: "Foundational",
    formula: "S_n = \\frac{a(1-r^n)}{1-r}",
    explanation: "Calculates the sum of the first n terms of a geometric progression.",
    variables: [
      { symbol: "S_n", meaning: "sum of n terms" },
      { symbol: "a", meaning: "first term" },
      { symbol: "r", meaning: "common ratio" },
      { symbol: "n", meaning: "number of terms" },
    ],
    example: "Find sum of first 5 terms with a=3, r=2",
  },
  {
    id: 617,
    title: "Logarithm Change of Base",
    subject: "Mathematics",
    category: "Algebra",
    level: "University",
    formula: "\\log_a b = \\frac{\\log_c b}{\\log_c a}",
    explanation: "Converts a logarithm from one base to another.",
    variables: [
      { symbol: "a,b,c", meaning: "bases and argument" },
    ],
    example: "Find log_2 8 using base 10",
  },
  {
    id: 618,
    title: "Laws of Logarithms - Product",
    subject: "Mathematics",
    category: "Algebra",
    level: "Foundational",
    formula: "\\log(mn) = \\log m + \\log n",
    explanation: "Expresses the logarithm of a product as a sum of logarithms.",
    variables: [
      { symbol: "m,n", meaning: "positive real numbers" },
    ],
    example: "Simplify log(6) using log(2)+log(3)",
  },
  {
    id: 619,
    title: "Laws of Logarithms - Quotient",
    subject: "Mathematics",
    category: "Algebra",
    level: "Foundational",
    formula: "\\log\\left(\\frac{m}{n}\\right) = \\log m - \\log n",
    explanation: "Expresses the logarithm of a quotient as a difference of logarithms.",
    variables: [
      { symbol: "m,n", meaning: "positive real numbers" },
    ],
    example: "Simplify log(10/2)",
  },
  {
    id: 620,
    title: "Laws of Logarithms - Power",
    subject: "Mathematics",
    category: "Algebra",
    level: "Foundational",
    formula: "\\log(m^k) = k\\log m",
    explanation: "Expresses the logarithm of a power as a multiple of the logarithm.",
    variables: [
      { symbol: "m", meaning: "positive real number" },
      { symbol: "k", meaning: "exponent" },
    ],
    example: "Simplify log(2^5)",
  },
  {
    id: 621,
    title: "Surds - Rationalizing Denominator",
    subject: "Mathematics",
    category: "Algebra",
    level: "Foundational",
    formula: "\\frac{1}{\\sqrt{a}} = \\frac{\\sqrt{a}}{a}",
    explanation: "Removes a surd from the denominator of a fraction.",
    variables: [
      { symbol: "a", meaning: "positive number under root" },
    ],
    example: "Rationalize 1/√3",
  },
  {
    id: 622,
    title: "Arithmetic Mean of n Terms",
    subject: "Mathematics",
    category: "Algebra",
    level: "Foundational",
    formula: "AM = \\frac{a_1+a_2+\\dots+a_n}{n}",
    explanation: "Calculates the average of a set of numbers.",
    variables: [
      { symbol: "a_1,\\dots,a_n", meaning: "individual values" },
      { symbol: "n", meaning: "number of values" },
    ],
    example: "Find AM of 2,4,6,8",
  },
  {
    id: 623,
    title: "Geometric Mean of Two Numbers",
    subject: "Mathematics",
    category: "Algebra",
    level: "University",
    formula: "GM = \\sqrt{ab}",
    explanation: "Calculates the geometric mean between two positive numbers.",
    variables: [
      { symbol: "a,b", meaning: "two positive numbers" },
    ],
    example: "Find GM of 4 and 9",
  },
  {
    id: 624,
    title: "Inequality - Modulus Solution",
    subject: "Mathematics",
    category: "Algebra",
    level: "University",
    formula: "|x| < a \\Rightarrow -a < x < a",
    explanation: "Solves absolute value inequalities.",
    variables: [
      { symbol: "x", meaning: "variable" },
      { symbol: "a", meaning: "positive constant" },
    ],
    example: "Solve |x| < 5",
  },
  {
    id: 625,
    title: "Completing the Square",
    subject: "Mathematics",
    category: "Algebra",
    level: "Foundational",
    formula: "ax^2+bx+c = a\\left(x+\\frac{b}{2a}\\right)^2 + c - \\frac{b^2}{4a}",
    explanation: "Rewrites a quadratic expression in vertex form.",
    variables: [
      { symbol: "a,b,c", meaning: "coefficients of the quadratic" },
    ],
    example: "Complete the square for x^2+6x+5",
  },
  {
    id: 626,
    title: "Exponential Growth",
    subject: "Mathematics",
    category: "Algebra",
    level: "University",
    formula: "N(t) = N_0 e^{kt}",
    explanation: "Models quantities that grow at a rate proportional to their current value.",
    variables: [
      { symbol: "N(t)", meaning: "quantity at time t" },
      { symbol: "N_0", meaning: "initial quantity" },
      { symbol: "k", meaning: "growth constant" },
      { symbol: "t", meaning: "time" },
    ],
    example: "Find population after 5 years with N0=1000, k=0.03",
  },
  {
    id: 627,
    title: "Exponential Decay",
    subject: "Mathematics",
    category: "Algebra",
    level: "University",
    formula: "N(t) = N_0 e^{-kt}",
    explanation: "Models quantities that decrease at a rate proportional to their current value.",
    variables: [
      { symbol: "N(t)", meaning: "quantity at time t" },
      { symbol: "N_0", meaning: "initial quantity" },
      { symbol: "k", meaning: "decay constant" },
      { symbol: "t", meaning: "time" },
    ],
    example: "Find remaining mass after 10 years with N0=500, k=0.02",
  },
  {
    id: 628,
    title: "Product Rule",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "\\frac{d}{dx}(uv) = u'v + uv'",
    explanation: "Differentiates the product of two functions.",
    variables: [
      { symbol: "u,v", meaning: "functions of x" },
    ],
    example: "Differentiate x^2\\sin x",
  },
  {
    id: 629,
    title: "Quotient Rule",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "\\frac{d}{dx}\\left(\\frac{u}{v}\\right) = \\frac{u'v - uv'}{v^2}",
    explanation: "Differentiates the quotient of two functions.",
    variables: [
      { symbol: "u,v", meaning: "functions of x" },
    ],
    example: "Differentiate x/(x+1)",
  },
  {
    id: 630,
    title: "Derivative of sin x",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "\\frac{d}{dx}(\\sin x) = \\cos x",
    explanation: "Standard derivative of the sine function.",
    variables: [
      { symbol: "x", meaning: "angle in radians" },
    ],
    example: "Differentiate sin(x) at x=0",
  },
  {
    id: 631,
    title: "Derivative of cos x",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "\\frac{d}{dx}(\\cos x) = -\\sin x",
    explanation: "Standard derivative of the cosine function.",
    variables: [
      { symbol: "x", meaning: "angle in radians" },
    ],
    example: "Differentiate cos(x) at x=π/2",
  },
  {
    id: 632,
    title: "Derivative of ln x",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "\\frac{d}{dx}(\\ln x) = \\frac{1}{x}",
    explanation: "Standard derivative of the natural logarithm function.",
    variables: [
      { symbol: "x", meaning: "positive real number" },
    ],
    example: "Differentiate ln(x) at x=2",
  },
  {
    id: 633,
    title: "Definite Integral - Area Under Curve",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "A = \\int_a^b f(x)\\,dx",
    explanation: "Calculates the area under a curve between two limits.",
    variables: [
      { symbol: "a,b", meaning: "lower and upper limits" },
      { symbol: "f(x)", meaning: "function" },
    ],
    example: "Find area under y=x^2 from x=0 to x=2",
  },
  {
    id: 634,
    title: "Volume of Revolution",
    subject: "Mathematics",
    category: "Calculus",
    level: "University",
    formula: "V = \\pi \\int_a^b [f(x)]^2 dx",
    explanation: "Calculates the volume generated when a curve is rotated about the x-axis.",
    variables: [
      { symbol: "f(x)", meaning: "function defining the curve" },
      { symbol: "a,b", meaning: "limits of rotation" },
    ],
    example: "Find volume of y=x rotated about x-axis from 0 to 3",
  },
  {
    id: 635,
    title: "Area of Triangle (Trig Form)",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "Foundational",
    formula: "A = \\frac{1}{2}ab\\sin C",
    explanation: "Calculates the area of a triangle using two sides and included angle.",
    variables: [
      { symbol: "a,b", meaning: "two sides" },
      { symbol: "C", meaning: "included angle" },
    ],
    example: "Find area with a=6, b=8, C=45°",
  },
  {
    id: 636,
    title: "Tangent Identity",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "Foundational",
    formula: "\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}",
    explanation: "Expresses tangent in terms of sine and cosine.",
    variables: [
      { symbol: "\\theta", meaning: "angle" },
    ],
    example: "Find tan(45°) using sin and cos",
  },
  {
    id: 637,
    title: "Double Angle Formula - Sine",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "University",
    formula: "\\sin 2\\theta = 2\\sin\\theta\\cos\\theta",
    explanation: "Expresses sine of double angle in terms of single angle.",
    variables: [
      { symbol: "\\theta", meaning: "angle" },
    ],
    example: "Find sin(60°) using sin(30°) and cos(30°)",
  },
  {
    id: 638,
    title: "Double Angle Formula - Cosine",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "University",
    formula: "\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta",
    explanation: "Expresses cosine of double angle in terms of single angle.",
    variables: [
      { symbol: "\\theta", meaning: "angle" },
    ],
    example: "Find cos(60°) using cos(30°) and sin(30°)",
  },
  {
    id: 639,
    title: "Compound Angle Formula - Sine",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "University",
    formula: "\\sin(A \\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B",
    explanation: "Expands the sine of a sum or difference of two angles.",
    variables: [
      { symbol: "A,B", meaning: "two angles" },
    ],
    example: "Find sin(75°) using sin(45°+30°)",
  },
  {
    id: 640,
    title: "Compound Angle Formula - Cosine",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "University",
    formula: "\\cos(A \\pm B) = \\cos A\\cos B \\mp \\sin A\\sin B",
    explanation: "Expands the cosine of a sum or difference of two angles.",
    variables: [
      { symbol: "A,B", meaning: "two angles" },
    ],
    example: "Find cos(15°) using cos(45°-30°)",
  },
  {
    id: 641,
    title: "Radian to Degree Conversion",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "Foundational",
    formula: "\\theta_{deg} = \\theta_{rad}\\times\\frac{180}{\\pi}",
    explanation: "Converts an angle from radians to degrees.",
    variables: [
      { symbol: "\\theta_{rad}", meaning: "angle in radians" },
    ],
    example: "Convert π/3 radians to degrees",
  },
  {
    id: 642,
    title: "Arc Length",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "Foundational",
    formula: "s = r\\theta",
    explanation: "Calculates the length of an arc given radius and angle in radians.",
    variables: [
      { symbol: "s", meaning: "arc length" },
      { symbol: "r", meaning: "radius" },
      { symbol: "\\theta", meaning: "angle in radians" },
    ],
    example: "Find arc length for r=10cm, θ=1.5 rad",
  },
  {
    id: 643,
    title: "Midpoint of a Line Segment",
    subject: "Mathematics",
    category: "Coordinate Geometry",
    level: "Foundational",
    formula: "M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)",
    explanation: "Finds the midpoint between two coordinate points.",
    variables: [
      { symbol: "x_1,y_1", meaning: "first point" },
      { symbol: "x_2,y_2", meaning: "second point" },
    ],
    example: "Find midpoint of (2,3) and (6,9)",
  },
  {
    id: 644,
    title: "Equation of a Straight Line (Point-Slope)",
    subject: "Mathematics",
    category: "Coordinate Geometry",
    level: "Foundational",
    formula: "y - y_1 = m(x - x_1)",
    explanation: "Gives the equation of a line through a point with known slope.",
    variables: [
      { symbol: "m", meaning: "slope" },
      { symbol: "x_1,y_1", meaning: "known point" },
    ],
    example: "Find equation of line through (2,3) with slope 4",
  },
  {
    id: 645,
    title: "Equation of a Circle",
    subject: "Mathematics",
    category: "Coordinate Geometry",
    level: "University",
    formula: "(x-a)^2 + (y-b)^2 = r^2",
    explanation: "Gives the equation of a circle with centre and radius.",
    variables: [
      { symbol: "a,b", meaning: "centre coordinates" },
      { symbol: "r", meaning: "radius" },
    ],
    example: "Find equation of circle centre (2,-1), radius 5",
  },
  {
    id: 646,
    title: "Gradient of Perpendicular Lines",
    subject: "Mathematics",
    category: "Coordinate Geometry",
    level: "Foundational",
    formula: "m_1 \\times m_2 = -1",
    explanation: "Relates the gradients of two perpendicular lines.",
    variables: [
      { symbol: "m_1,m_2", meaning: "gradients of the two lines" },
    ],
    example: "Find gradient perpendicular to line of slope 2",
  },
  {
    id: 647,
    title: "Section Formula (Internal Division)",
    subject: "Mathematics",
    category: "Coordinate Geometry",
    level: "University",
    formula: "P = \\left(\\frac{mx_2+nx_1}{m+n}, \\frac{my_2+ny_1}{m+n}\\right)",
    explanation: "Finds the coordinates of a point dividing a line segment internally in a given ratio.",
    variables: [
      { symbol: "m:n", meaning: "ratio of division" },
      { symbol: "x_1,y_1,x_2,y_2", meaning: "endpoints" },
    ],
    example: "Find point dividing (2,3) and (8,9) in ratio 1:2",
  },
  {
    id: 648,
    title: "Determinant of a 2x2 Matrix",
    subject: "Mathematics",
    category: "Matrices",
    level: "University",
    formula: "\\det(A) = ad - bc",
    explanation: "Calculates the determinant of a 2x2 matrix.",
    variables: [
      { symbol: "a,b,c,d", meaning: "entries of matrix A = [[a,b],[c,d]]" },
    ],
    example: "Find determinant of [[3,4],[2,5]]",
  },
  {
    id: 649,
    title: "Inverse of a 2x2 Matrix",
    subject: "Mathematics",
    category: "Matrices",
    level: "University",
    formula: "A^{-1} = \\frac{1}{ad-bc}\\begin{pmatrix}d & -b\\\\ -c & a\\end{pmatrix}",
    explanation: "Finds the inverse of a 2x2 matrix.",
    variables: [
      { symbol: "a,b,c,d", meaning: "entries of matrix A" },
    ],
    example: "Find inverse of [[2,1],[1,1]]",
  },
  {
    id: 650,
    title: "Determinant of a 3x3 Matrix",
    subject: "Mathematics",
    category: "Matrices",
    level: "University",
    formula: "\\det(A) = a(ei-fh) - b(di-fg) + c(dh-eg)",
    explanation: "Calculates the determinant of a 3x3 matrix by cofactor expansion.",
    variables: [
      { symbol: "a\\text{-}i", meaning: "entries of the 3x3 matrix" },
    ],
    example: "Find determinant of a given 3x3 matrix",
  },
  {
    id: 651,
    title: "Magnitude of a Vector",
    subject: "Mathematics",
    category: "Vectors",
    level: "University",
    formula: "|\\vec{v}| = \\sqrt{x^2+y^2+z^2}",
    explanation: "Calculates the length (magnitude) of a vector.",
    variables: [
      { symbol: "x,y,z", meaning: "components of the vector" },
    ],
    example: "Find magnitude of vector (3,4,0)",
  },
  {
    id: 652,
    title: "Dot Product of Two Vectors",
    subject: "Mathematics",
    category: "Vectors",
    level: "University",
    formula: "\\vec{a}\\cdot\\vec{b} = a_1b_1+a_2b_2+a_3b_3",
    explanation: "Calculates the scalar product of two vectors.",
    variables: [
      { symbol: "a_i,b_i", meaning: "components of vectors a and b" },
    ],
    example: "Find dot product of (1,2,3) and (4,5,6)",
  },
  {
    id: 653,
    title: "Cross Product of Two Vectors",
    subject: "Mathematics",
    category: "Vectors",
    level: "University",
    formula: "\\vec{a}\\times\\vec{b} = |\\vec{a}||\\vec{b}|\\sin\\theta\\,\\hat{n}",
    explanation: "Calculates the vector product of two vectors, producing a vector perpendicular to both.",
    variables: [
      { symbol: "\\theta", meaning: "angle between vectors" },
      { symbol: "\\hat{n}", meaning: "unit normal vector" },
    ],
    example: "Find magnitude of cross product for vectors of length 3 and 4 at 90°",
  },
  {
    id: 654,
    title: "Unit Vector",
    subject: "Mathematics",
    category: "Vectors",
    level: "University",
    formula: "\\hat{a} = \\frac{\\vec{a}}{|\\vec{a}|}",
    explanation: "Finds a vector of magnitude 1 in the same direction as a given vector.",
    variables: [
      { symbol: "\\vec{a}", meaning: "original vector" },
      { symbol: "|\\vec{a}|", meaning: "magnitude of the vector" },
    ],
    example: "Find unit vector of (3,4)",
  },
  {
    id: 655,
    title: "Highest Common Factor via Prime Factors",
    subject: "Mathematics",
    category: "Number Theory",
    level: "Foundational",
    formula: "HCF = \\text{product of lowest powers of common primes}",
    explanation: "Finds the highest common factor of two or more numbers.",
    variables: [
      { symbol: "—", meaning: "derived from prime factorization" },
    ],
    example: "Find HCF of 24 and 36",
  },
  {
    id: 656,
    title: "Lowest Common Multiple via Prime Factors",
    subject: "Mathematics",
    category: "Number Theory",
    level: "Foundational",
    formula: "LCM = \\text{product of highest powers of all primes}",
    explanation: "Finds the lowest common multiple of two or more numbers.",
    variables: [
      { symbol: "—", meaning: "derived from prime factorization" },
    ],
    example: "Find LCM of 4 and 6",
  },
  {
    id: 657,
    title: "Relationship Between HCF and LCM",
    subject: "Mathematics",
    category: "Number Theory",
    level: "Foundational",
    formula: "HCF(a,b)\\times LCM(a,b) = a\\times b",
    explanation: "Relates the HCF and LCM of two numbers to their product.",
    variables: [
      { symbol: "a,b", meaning: "two positive integers" },
    ],
    example: "Find LCM of 8 and 12 given HCF=4",
  },
  {
    id: 658,
    title: "Surface Area of a Sphere",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "A = 4\\pi r^2",
    explanation: "Calculates the total surface area of a sphere.",
    variables: [
      { symbol: "A", meaning: "surface area" },
      { symbol: "r", meaning: "radius" },
    ],
    example: "Find surface area of sphere with r=7cm",
  },
  {
    id: 659,
    title: "Volume of a Sphere",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "V = \\frac{4}{3}\\pi r^3",
    explanation: "Calculates the volume of a sphere.",
    variables: [
      { symbol: "V", meaning: "volume" },
      { symbol: "r", meaning: "radius" },
    ],
    example: "Find volume of sphere with r=6cm",
  },
  {
    id: 660,
    title: "Volume of a Cone",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "V = \\frac{1}{3}\\pi r^2 h",
    explanation: "Calculates the volume of a cone.",
    variables: [
      { symbol: "V", meaning: "volume" },
      { symbol: "r", meaning: "base radius" },
      { symbol: "h", meaning: "height" },
    ],
    example: "Find volume of cone with r=3cm, h=9cm",
  },
  {
    id: 661,
    title: "Curved Surface Area of a Cone",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "A = \\pi r l",
    explanation: "Calculates the curved (lateral) surface area of a cone.",
    variables: [
      { symbol: "r", meaning: "base radius" },
      { symbol: "l", meaning: "slant height" },
    ],
    example: "Find CSA of cone with r=4cm, l=10cm",
  },
  {
    id: 662,
    title: "Volume of a Pyramid",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "V = \\frac{1}{3}\\times\\text{Base Area}\\times h",
    explanation: "Calculates the volume of a pyramid.",
    variables: [
      { symbol: "h", meaning: "perpendicular height" },
    ],
    example: "Find volume of pyramid with base area 20cm² and height 9cm",
  },
  {
    id: 663,
    title: "Volume of a Cuboid",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "V = l\\times w\\times h",
    explanation: "Calculates the volume of a rectangular cuboid.",
    variables: [
      { symbol: "l,w,h", meaning: "length, width, height" },
    ],
    example: "Find volume of cuboid 5cm x 3cm x 4cm",
  },
  {
    id: 664,
    title: "Perimeter of a Rectangle",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "P = 2(l+w)",
    explanation: "Calculates the perimeter of a rectangle.",
    variables: [
      { symbol: "l,w", meaning: "length and width" },
    ],
    example: "Find perimeter for l=8cm, w=5cm",
  },
  {
    id: 665,
    title: "Area of a Trapezium",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "A = \\frac{1}{2}(a+b)h",
    explanation: "Calculates the area of a trapezium.",
    variables: [
      { symbol: "a,b", meaning: "parallel sides" },
      { symbol: "h", meaning: "perpendicular height" },
    ],
    example: "Find area with a=6cm, b=10cm, h=4cm",
  },
  {
    id: 666,
    title: "Area of a Parallelogram",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "A = b\\times h",
    explanation: "Calculates the area of a parallelogram.",
    variables: [
      { symbol: "b", meaning: "base" },
      { symbol: "h", meaning: "perpendicular height" },
    ],
    example: "Find area with b=12cm, h=5cm",
  },
  {
    id: 667,
    title: "Area of a Rhombus",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "A = \\frac{1}{2}d_1d_2",
    explanation: "Calculates the area of a rhombus using its diagonals.",
    variables: [
      { symbol: "d_1,d_2", meaning: "lengths of the diagonals" },
    ],
    example: "Find area with d1=8cm, d2=6cm",
  },
  {
    id: 668,
    title: "Circumference of a Circle",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "C = 2\\pi r",
    explanation: "Calculates the circumference of a circle.",
    variables: [
      { symbol: "C", meaning: "circumference" },
      { symbol: "r", meaning: "radius" },
    ],
    example: "Find circumference for r=7cm",
  },
  {
    id: 669,
    title: "Surface Area of a Cylinder",
    subject: "Mathematics",
    category: "Mensuration",
    level: "Foundational",
    formula: "A = 2\\pi r h + 2\\pi r^2",
    explanation: "Calculates the total surface area of a closed cylinder.",
    variables: [
      { symbol: "r", meaning: "radius" },
      { symbol: "h", meaning: "height" },
    ],
    example: "Find surface area with r=5cm, h=10cm",
  },
  {
    id: 670,
    title: "Standard Deviation (Population)",
    subject: "Mathematics",
    category: "Statistics",
    level: "University",
    formula: "\\sigma = \\sqrt{\\frac{\\sum(x-\\bar{x})^2}{n}}",
    explanation: "Measures the spread of data about the mean.",
    variables: [
      { symbol: "x", meaning: "individual data value" },
      { symbol: "\\bar{x}", meaning: "mean" },
      { symbol: "n", meaning: "number of values" },
    ],
    example: "Find standard deviation of 2,4,6,8,10",
  },
  {
    id: 671,
    title: "Range of a Data Set",
    subject: "Mathematics",
    category: "Statistics",
    level: "Foundational",
    formula: "R = X_{max} - X_{min}",
    explanation: "Measures the spread between the largest and smallest values.",
    variables: [
      { symbol: "X_{max}", meaning: "maximum value" },
      { symbol: "X_{min}", meaning: "minimum value" },
    ],
    example: "Find range of 3,7,9,15,22",
  },
  {
    id: 672,
    title: "Probability of Complementary Event",
    subject: "Mathematics",
    category: "Statistics",
    level: "Foundational",
    formula: "P(A') = 1 - P(A)",
    explanation: "Finds the probability that an event does not occur.",
    variables: [
      { symbol: "P(A)", meaning: "probability event A occurs" },
    ],
    example: "Find P(not rain) if P(rain)=0.3",
  },
  {
    id: 673,
    title: "Binomial Probability",
    subject: "Mathematics",
    category: "Statistics",
    level: "University",
    formula: "P(X=k) = \\binom{n}{k}p^k(1-p)^{n-k}",
    explanation: "Calculates the probability of k successes in n independent trials.",
    variables: [
      { symbol: "n", meaning: "number of trials" },
      { symbol: "p", meaning: "probability of success" },
      { symbol: "k", meaning: "number of successes" },
    ],
    example: "Find P(3 heads in 5 tosses)",
  },
  {
    id: 674,
    title: "Poisson Probability",
    subject: "Mathematics",
    category: "Statistics",
    level: "University",
    formula: "P(X=k) = \\frac{e^{-\\lambda}\\lambda^k}{k!}",
    explanation: "Models the probability of a given number of events in a fixed interval.",
    variables: [
      { symbol: "\\lambda", meaning: "average rate of occurrence" },
      { symbol: "k", meaning: "number of events" },
    ],
    example: "Find P(2 calls) if λ=3 calls/hour",
  },
  {
    id: 675,
    title: "Line of Best Fit (Regression)",
    subject: "Mathematics",
    category: "Statistics",
    level: "University",
    formula: "y = a + bx,\\quad b = \\frac{n\\sum xy - \\sum x\\sum y}{n\\sum x^2 - (\\sum x)^2}",
    explanation: "Finds the linear regression line that best fits bivariate data.",
    variables: [
      { symbol: "a", meaning: "intercept" },
      { symbol: "b", meaning: "slope" },
    ],
    example: "Fit a regression line to sales vs advertising data",
  },
  {
    id: 783,
    title: "Law of Cosines for Angle",
    subject: "Mathematics",
    category: "Trigonometry",
    level: "University",
    formula: "\\cos A = \\frac{b^2+c^2-a^2}{2bc}",
    explanation: "Finds an angle of a triangle given all three side lengths.",
    variables: [
      { symbol: "a,b,c", meaning: "sides of the triangle" },
    ],
    example: "Find angle A for a=7, b=5, c=6",
  },
  {
    id: 784,
    title: "Interior Angle of a Regular Polygon",
    subject: "Mathematics",
    category: "Geometry",
    level: "Foundational",
    formula: "\\theta = \\frac{(n-2)\\times 180°}{n}",
    explanation: "Calculates each interior angle of a regular polygon.",
    variables: [
      { symbol: "n", meaning: "number of sides" },
    ],
    example: "Find interior angle of a regular pentagon",
  },
  {
    id: 789,
    title: "Chi-Square Test Statistic",
    subject: "Mathematics",
    category: "Statistics",
    level: "University",
    formula: "\\chi^2 = \\sum \\frac{(O-E)^2}{E}",
    explanation: "Tests whether observed frequencies differ significantly from expected frequencies.",
    variables: [
      { symbol: "O", meaning: "observed frequency" },
      { symbol: "E", meaning: "expected frequency" },
    ],
    example: "Test independence of two categorical variables using a contingency table",
  },
  {
    id: 790,
    title: "Confidence Interval for a Mean",
    subject: "Mathematics",
    category: "Statistics",
    level: "University",
    formula: "CI = \\bar{x} \\pm z\\frac{\\sigma}{\\sqrt{n}}",
    explanation: "Estimates a range within which the true population mean likely lies.",
    variables: [
      { symbol: "\\bar{x}", meaning: "sample mean" },
      { symbol: "z", meaning: "z-value for confidence level" },
      { symbol: "\\sigma", meaning: "standard deviation" },
      { symbol: "n", meaning: "sample size" },
    ],
    example: "Find 95% CI for x̄=50, σ=8, n=36",
  },
  {
    id: 791,
    title: "Spearman's Rank Correlation",
    subject: "Mathematics",
    category: "Statistics",
    level: "University",
    formula: "r_s = 1 - \\frac{6\\sum d^2}{n(n^2-1)}",
    explanation: "Measures the strength of a monotonic relationship between ranked variables.",
    variables: [
      { symbol: "d", meaning: "difference between ranks" },
      { symbol: "n", meaning: "number of pairs" },
    ],
    example: "Find rank correlation for two ranked data sets",
  },
  {
    id: 792,
    title: "Skewness Coefficient (Pearson's)",
    subject: "Mathematics",
    category: "Statistics",
    level: "University",
    formula: "Sk = \\frac{3(\\bar{x}-\\text{Median})}{\\sigma}",
    explanation: "Measures the asymmetry of a data distribution.",
    variables: [
      { symbol: "\\bar{x}", meaning: "mean" },
      { symbol: "\\sigma", meaning: "standard deviation" },
    ],
    example: "Find skewness for mean=45, median=42, σ=6",
  },
  // =========================
  // PHYSICS (new)
  // =========================
  {
    id: 676,
    title: "Equations of Motion - v=u+at",
    subject: "Physics",
    category: "Mechanics",
    level: "Foundational",
    formula: "v = u + at",
    explanation: "Relates final velocity to initial velocity, acceleration, and time.",
    variables: [
      { symbol: "v", meaning: "final velocity" },
      { symbol: "u", meaning: "initial velocity" },
      { symbol: "a", meaning: "acceleration" },
      { symbol: "t", meaning: "time" },
    ],
    example: "Find v for u=0, a=5m/s², t=4s",
  },
  {
    id: 677,
    title: "Equations of Motion - s=ut+1/2at^2",
    subject: "Physics",
    category: "Mechanics",
    level: "Foundational",
    formula: "s = ut + \\frac{1}{2}at^2",
    explanation: "Calculates displacement given initial velocity, acceleration, and time.",
    variables: [
      { symbol: "s", meaning: "displacement" },
      { symbol: "u", meaning: "initial velocity" },
      { symbol: "a", meaning: "acceleration" },
      { symbol: "t", meaning: "time" },
    ],
    example: "Find s for u=2m/s, a=3m/s², t=5s",
  },
  {
    id: 678,
    title: "Equations of Motion - v^2=u^2+2as",
    subject: "Physics",
    category: "Mechanics",
    level: "Foundational",
    formula: "v^2 = u^2 + 2as",
    explanation: "Relates velocity, acceleration, and displacement without time.",
    variables: [
      { symbol: "v", meaning: "final velocity" },
      { symbol: "u", meaning: "initial velocity" },
      { symbol: "a", meaning: "acceleration" },
      { symbol: "s", meaning: "displacement" },
    ],
    example: "Find v for u=0, a=2m/s², s=25m",
  },
  {
    id: 679,
    title: "Impulse",
    subject: "Physics",
    category: "Mechanics",
    level: "University",
    formula: "J = F\\Delta t = \\Delta p",
    explanation: "Relates force applied over time to the change in momentum.",
    variables: [
      { symbol: "F", meaning: "force" },
      { symbol: "\\Delta t", meaning: "time interval" },
      { symbol: "\\Delta p", meaning: "change in momentum" },
    ],
    example: "Find impulse for F=20N applied for 0.5s",
  },
  {
    id: 680,
    title: "Power",
    subject: "Physics",
    category: "Mechanics",
    level: "Foundational",
    formula: "P = \\frac{W}{t}",
    explanation: "Calculates the rate at which work is done.",
    variables: [
      { symbol: "W", meaning: "work done" },
      { symbol: "t", meaning: "time taken" },
    ],
    example: "Find power for W=1000J done in 20s",
  },
  {
    id: 681,
    title: "Law of Conservation of Momentum",
    subject: "Physics",
    category: "Mechanics",
    level: "University",
    formula: "m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2",
    explanation: "States that total momentum before collision equals total momentum after collision.",
    variables: [
      { symbol: "m_1,m_2", meaning: "masses of objects" },
      { symbol: "u_1,u_2", meaning: "initial velocities" },
      { symbol: "v_1,v_2", meaning: "final velocities" },
    ],
    example: "Find v2 after collision of two trolleys",
  },
  {
    id: 682,
    title: "Density",
    subject: "Physics",
    category: "Mechanics",
    level: "Foundational",
    formula: "\\rho = \\frac{m}{V}",
    explanation: "Calculates the mass per unit volume of a substance.",
    variables: [
      { symbol: "\\rho", meaning: "density" },
      { symbol: "m", meaning: "mass" },
      { symbol: "V", meaning: "volume" },
    ],
    example: "Find density for m=500g, V=100cm³",
  },
  {
    id: 683,
    title: "Pressure",
    subject: "Physics",
    category: "Mechanics",
    level: "Foundational",
    formula: "P = \\frac{F}{A}",
    explanation: "Calculates force exerted per unit area.",
    variables: [
      { symbol: "P", meaning: "pressure" },
      { symbol: "F", meaning: "force" },
      { symbol: "A", meaning: "area" },
    ],
    example: "Find pressure for F=100N, A=2m²",
  },
  {
    id: 684,
    title: "Pressure in a Fluid",
    subject: "Physics",
    category: "Mechanics",
    level: "University",
    formula: "P = h\\rho g",
    explanation: "Calculates pressure at a depth within a fluid.",
    variables: [
      { symbol: "h", meaning: "depth" },
      { symbol: "\\rho", meaning: "fluid density" },
      { symbol: "g", meaning: "gravitational acceleration" },
    ],
    example: "Find pressure at h=10m in water",
  },
  {
    id: 685,
    title: "Universal Law of Gravitation",
    subject: "Physics",
    category: "Mechanics",
    level: "University",
    formula: "F = \\frac{Gm_1m_2}{r^2}",
    explanation: "Calculates the gravitational force between two masses.",
    variables: [
      { symbol: "G", meaning: "gravitational constant" },
      { symbol: "m_1,m_2", meaning: "masses" },
      { symbol: "r", meaning: "distance between centres" },
    ],
    example: "Find gravitational force between Earth and a 1kg object",
  },
  {
    id: 686,
    title: "Velocity Ratio",
    subject: "Physics",
    category: "Mechanics",
    level: "Foundational",
    formula: "VR = \\frac{\\text{Distance moved by effort}}{\\text{Distance moved by load}}",
    explanation: "Measures the ratio of distances moved by effort and load in a machine.",
    variables: [
      { symbol: "—", meaning: "distances moved by effort and load" },
    ],
    example: "Find VR for effort distance=2m, load distance=0.5m",
  },
  {
    id: 687,
    title: "Refractive Index",
    subject: "Physics",
    category: "Optics",
    level: "Foundational",
    formula: "n = \\frac{c}{v}",
    explanation: "Measures how much light slows down in a medium compared to a vacuum.",
    variables: [
      { symbol: "c", meaning: "speed of light in vacuum" },
      { symbol: "v", meaning: "speed of light in medium" },
    ],
    example: "Find refractive index for v=2×10^8 m/s",
  },
  {
    id: 688,
    title: "Magnification (Optics)",
    subject: "Physics",
    category: "Optics",
    level: "Foundational",
    formula: "m = \\frac{v}{u} = \\frac{h_i}{h_o}",
    explanation: "Calculates the magnification produced by a lens or mirror.",
    variables: [
      { symbol: "v,u", meaning: "image and object distances" },
      { symbol: "h_i,h_o", meaning: "image and object heights" },
    ],
    example: "Find magnification for v=20cm, u=10cm",
  },
  {
    id: 689,
    title: "Lens Power",
    subject: "Physics",
    category: "Optics",
    level: "University",
    formula: "P = \\frac{1}{f}",
    explanation: "Calculates the power of a lens in dioptres.",
    variables: [
      { symbol: "f", meaning: "focal length in metres" },
    ],
    example: "Find power of lens with f=0.5m",
  },
  {
    id: 690,
    title: "Electrical Power (Resistance Form)",
    subject: "Physics",
    category: "Electricity",
    level: "Foundational",
    formula: "P = I^2R",
    explanation: "Calculates electrical power dissipated in a resistor.",
    variables: [
      { symbol: "I", meaning: "current" },
      { symbol: "R", meaning: "resistance" },
    ],
    example: "Find power for I=3A, R=10Ω",
  },
  {
    id: 691,
    title: "Resistivity",
    subject: "Physics",
    category: "Electricity",
    level: "University",
    formula: "R = \\frac{\\rho L}{A}",
    explanation: "Calculates the resistance of a conductor from its material and dimensions.",
    variables: [
      { symbol: "\\rho", meaning: "resistivity" },
      { symbol: "L", meaning: "length" },
      { symbol: "A", meaning: "cross-sectional area" },
    ],
    example: "Find resistance for ρ=1.7×10⁻⁸Ωm, L=2m, A=1mm²",
  },
  {
    id: 692,
    title: "Capacitors in Parallel",
    subject: "Physics",
    category: "Electricity",
    level: "University",
    formula: "C_T = C_1+C_2+C_3+\\dots",
    explanation: "Calculates total capacitance of capacitors connected in parallel.",
    variables: [
      { symbol: "C_1,C_2,\\dots", meaning: "individual capacitances" },
    ],
    example: "Find total capacitance for C1=2μF, C2=3μF",
  },
  {
    id: 693,
    title: "Capacitors in Series",
    subject: "Physics",
    category: "Electricity",
    level: "University",
    formula: "\\frac{1}{C_T} = \\frac{1}{C_1}+\\frac{1}{C_2}+\\dots",
    explanation: "Calculates total capacitance of capacitors connected in series.",
    variables: [
      { symbol: "C_1,C_2,\\dots", meaning: "individual capacitances" },
    ],
    example: "Find total capacitance for C1=4μF, C2=4μF",
  },
  {
    id: 694,
    title: "Magnetic Force on a Current-Carrying Conductor",
    subject: "Physics",
    category: "Electricity",
    level: "University",
    formula: "F = BIL\\sin\\theta",
    explanation: "Calculates the force on a current-carrying wire in a magnetic field.",
    variables: [
      { symbol: "B", meaning: "magnetic flux density" },
      { symbol: "I", meaning: "current" },
      { symbol: "L", meaning: "length of conductor" },
      { symbol: "\\theta", meaning: "angle between field and current" },
    ],
    example: "Find force for B=0.5T, I=2A, L=0.3m, θ=90°",
  },
  {
    id: 695,
    title: "Electromagnetic Induction (Faraday's Law)",
    subject: "Physics",
    category: "Electricity",
    level: "University",
    formula: "EMF = -N\\frac{d\\Phi}{dt}",
    explanation: "Calculates the induced EMF from a changing magnetic flux.",
    variables: [
      { symbol: "N", meaning: "number of turns" },
      { symbol: "d\\Phi/dt", meaning: "rate of change of flux" },
    ],
    example: "Find EMF for N=100, flux changing at 0.02Wb/s",
  },
  {
    id: 696,
    title: "Latent Heat",
    subject: "Physics",
    category: "Thermodynamics",
    level: "Foundational",
    formula: "Q = mL",
    explanation: "Calculates the heat energy needed for a phase change.",
    variables: [
      { symbol: "Q", meaning: "heat energy" },
      { symbol: "m", meaning: "mass" },
      { symbol: "L", meaning: "specific latent heat" },
    ],
    example: "Find Q for m=0.5kg, L=334000J/kg",
  },
  {
    id: 697,
    title: "Thermal Expansion (Linear)",
    subject: "Physics",
    category: "Thermodynamics",
    level: "University",
    formula: "\\Delta L = \\alpha L_0 \\Delta T",
    explanation: "Calculates the change in length of a material due to temperature change.",
    variables: [
      { symbol: "\\alpha", meaning: "coefficient of linear expansion" },
      { symbol: "L_0", meaning: "original length" },
      { symbol: "\\Delta T", meaning: "change in temperature" },
    ],
    example: "Find ΔL for α=12×10⁻⁶/°C, L0=2m, ΔT=50°C",
  },
  {
    id: 698,
    title: "Photon Energy",
    subject: "Physics",
    category: "Modern Physics",
    level: "University",
    formula: "E = hf",
    explanation: "Calculates the energy of a photon from its frequency.",
    variables: [
      { symbol: "h", meaning: "Planck's constant" },
      { symbol: "f", meaning: "frequency" },
    ],
    example: "Find energy for f=5×10^14 Hz",
  },
  {
    id: 785,
    title: "Escape from a Free Fall (Time to Fall)",
    subject: "Physics",
    category: "Mechanics",
    level: "Foundational",
    formula: "t = \\sqrt{\\frac{2h}{g}}",
    explanation: "Calculates the time for an object to fall freely from a given height.",
    variables: [
      { symbol: "h", meaning: "height" },
      { symbol: "g", meaning: "gravitational acceleration" },
    ],
    example: "Find fall time for h=20m",
  },
  {
    id: 786,
    title: "Terminal Velocity",
    subject: "Physics",
    category: "Mechanics",
    level: "University",
    formula: "v_t = \\sqrt{\\frac{2mg}{\\rho A C_d}}",
    explanation: "Calculates the maximum velocity a falling object reaches when drag balances gravity.",
    variables: [
      { symbol: "m", meaning: "mass" },
      { symbol: "\\rho", meaning: "fluid density" },
      { symbol: "A", meaning: "cross-sectional area" },
      { symbol: "C_d", meaning: "drag coefficient" },
    ],
    example: "Find terminal velocity of a falling sphere",
  },
  {
    id: 812,
    title: "Power in Rotational Motion",
    subject: "Physics",
    category: "Mechanics",
    level: "University",
    formula: "P = \\tau \\omega",
    explanation: "Calculates power delivered by a rotating shaft or wheel.",
    variables: [
      { symbol: "\\tau", meaning: "torque" },
      { symbol: "\\omega", meaning: "angular velocity" },
    ],
    example: "Find power for τ=30Nm, ω=10rad/s",
  },
  {
    id: 813,
    title: "Buoyant Force (Archimedes' Principle)",
    subject: "Physics",
    category: "Mechanics",
    level: "Foundational",
    formula: "F_B = \\rho V g",
    explanation: "Calculates the upward force exerted on a submerged or floating object.",
    variables: [
      { symbol: "\\rho", meaning: "density of fluid displaced" },
      { symbol: "V", meaning: "volume of fluid displaced" },
      { symbol: "g", meaning: "gravitational acceleration" },
    ],
    example: "Find buoyant force for V=0.02m³ displaced in water",
  },
  // =========================
  // CHEMISTRY (new)
  // =========================
  {
    id: 699,
    title: "Mole Concept",
    subject: "Chemistry",
    category: "Stoichiometry",
    level: "Foundational",
    formula: "n = \\frac{m}{M}",
    explanation: "Calculates the number of moles of a substance from its mass and molar mass.",
    variables: [
      { symbol: "n", meaning: "number of moles" },
      { symbol: "m", meaning: "mass" },
      { symbol: "M", meaning: "molar mass" },
    ],
    example: "Find moles in 44g of CO2 (M=44g/mol)",
  },
  {
    id: 700,
    title: "Molar Volume of a Gas at STP",
    subject: "Chemistry",
    category: "Stoichiometry",
    level: "Foundational",
    formula: "V = n\\times 22.4\\ \\text{L}",
    explanation: "Relates moles of gas to volume at standard temperature and pressure.",
    variables: [
      { symbol: "n", meaning: "number of moles" },
    ],
    example: "Find volume of 2 moles of gas at STP",
  },
  {
    id: 701,
    title: "pH of a Solution",
    subject: "Chemistry",
    category: "Acids and Bases",
    level: "University",
    formula: "pH = -\\log[H^+]",
    explanation: "Measures the acidity or alkalinity of a solution.",
    variables: [
      { symbol: "[H^+]", meaning: "hydrogen ion concentration" },
    ],
    example: "Find pH for [H+]=1×10⁻³ mol/L",
  },
  {
    id: 702,
    title: "pOH of a Solution",
    subject: "Chemistry",
    category: "Acids and Bases",
    level: "University",
    formula: "pOH = -\\log[OH^-]",
    explanation: "Measures the basicity of a solution.",
    variables: [
      { symbol: "[OH^-]", meaning: "hydroxide ion concentration" },
    ],
    example: "Find pOH for [OH-]=1×10⁻⁵ mol/L",
  },
  {
    id: 703,
    title: "Faraday's Law of Electrolysis",
    subject: "Chemistry",
    category: "Electrochemistry",
    level: "University",
    formula: "m = \\frac{ItM}{nF}",
    explanation: "Calculates the mass of substance deposited during electrolysis.",
    variables: [
      { symbol: "I", meaning: "current" },
      { symbol: "t", meaning: "time" },
      { symbol: "M", meaning: "molar mass" },
      { symbol: "n", meaning: "number of electrons" },
      { symbol: "F", meaning: "Faraday's constant" },
    ],
    example: "Find mass of copper deposited by 2A for 1 hour",
  },
  {
    id: 704,
    title: "Enthalpy Change of Reaction",
    subject: "Chemistry",
    category: "Thermochemistry",
    level: "University",
    formula: "\\Delta H = H_{products} - H_{reactants}",
    explanation: "Calculates the heat change of a chemical reaction.",
    variables: [
      { symbol: "H_{products},H_{reactants}", meaning: "enthalpies of products and reactants" },
    ],
    example: "Find ΔH given enthalpies of reactants and products",
  },
  {
    id: 705,
    title: "Heat of Reaction (Calorimetry)",
    subject: "Chemistry",
    category: "Thermochemistry",
    level: "University",
    formula: "q = mc\\Delta T",
    explanation: "Calculates heat released or absorbed in a reaction using calorimetry.",
    variables: [
      { symbol: "m", meaning: "mass of solution" },
      { symbol: "c", meaning: "specific heat capacity" },
      { symbol: "\\Delta T", meaning: "temperature change" },
    ],
    example: "Find heat released for m=100g, c=4.18J/gK, ΔT=5K",
  },
  {
    id: 706,
    title: "Empirical Formula from Percentage Composition",
    subject: "Chemistry",
    category: "Stoichiometry",
    level: "Foundational",
    formula: "\\text{Mole Ratio} = \\frac{\\%\\text{Element}}{\\text{Atomic Mass}}",
    explanation: "Determines the simplest whole-number ratio of atoms in a compound.",
    variables: [
      { symbol: "\\%\\text{Element}", meaning: "percentage by mass of an element" },
    ],
    example: "Find empirical formula for compound with 40% C, 6.7% H, 53.3% O",
  },
  {
    id: 707,
    title: "Combined Gas Law",
    subject: "Chemistry",
    category: "Gas Laws",
    level: "University",
    formula: "\\frac{P_1V_1}{T_1} = \\frac{P_2V_2}{T_2}",
    explanation: "Combines Boyle's, Charles's, and Gay-Lussac's laws into one relationship.",
    variables: [
      { symbol: "P,V,T", meaning: "pressure, volume, temperature at states 1 and 2" },
    ],
    example: "Find V2 for a gas changing pressure and temperature",
  },
  {
    id: 787,
    title: "Avogadro's Number Relation",
    subject: "Chemistry",
    category: "Stoichiometry",
    level: "Foundational",
    formula: "N = n \\times N_A",
    explanation: "Relates the number of particles to moles using Avogadro's constant.",
    variables: [
      { symbol: "n", meaning: "number of moles" },
      { symbol: "N_A", meaning: "Avogadro's number (6.02×10²³)" },
    ],
    example: "Find number of molecules in 2 moles of water",
  },
  {
    id: 788,
    title: "Concentration in Parts Per Million",
    subject: "Chemistry",
    category: "Solutions",
    level: "University",
    formula: "ppm = \\frac{\\text{Mass of Solute}}{\\text{Mass of Solution}}\\times 10^6",
    explanation: "Expresses very dilute concentrations in parts per million.",
    variables: [
      { symbol: "—", meaning: "mass of solute and mass of total solution" },
    ],
    example: "Find ppm for 0.002g solute in 1000g solution",
  },
  {
    id: 802,
    title: "Van der Waals Equation",
    subject: "Chemistry",
    category: "Gas Laws",
    level: "University",
    formula: "\\left(P+\\frac{an^2}{V^2}\\right)(V-nb) = nRT",
    explanation: "Corrects the ideal gas law for real gas behaviour, accounting for molecular size and attraction.",
    variables: [
      { symbol: "a,b", meaning: "gas-specific correction constants" },
      { symbol: "P,V,n,T", meaning: "pressure, volume, moles, temperature" },
    ],
    example: "Apply Van der Waals equation to a real gas at high pressure",
  },
  {
    id: 803,
    title: "Half Reaction Balancing (Electrons Transferred)",
    subject: "Chemistry",
    category: "Electrochemistry",
    level: "University",
    formula: "n = \\frac{Q}{F}",
    explanation: "Calculates moles of electrons transferred during electrolysis from total charge.",
    variables: [
      { symbol: "Q", meaning: "total charge passed (coulombs)" },
      { symbol: "F", meaning: "Faraday's constant" },
    ],
    example: "Find moles of electrons for Q=9650C",
  },
  {
    id: 804,
    title: "Half-Life of a First-Order Reaction",
    subject: "Chemistry",
    category: "Kinetics",
    level: "University",
    formula: "t_{1/2} = \\frac{0.693}{k}",
    explanation: "Calculates the time for half of a reactant to be consumed in a first-order reaction.",
    variables: [
      { symbol: "k", meaning: "rate constant" },
    ],
    example: "Find half-life for k=0.05/min",
  },
  // =========================
  // BIOLOGY (new)
  // =========================
  {
    id: 708,
    title: "Magnification (Microscopy)",
    subject: "Biology",
    category: "Cell Biology",
    level: "Foundational",
    formula: "M = \\frac{\\text{Image Size}}{\\text{Actual Size}}",
    explanation: "Calculates the magnification of a specimen viewed under a microscope.",
    variables: [
      { symbol: "—", meaning: "observed image size and actual specimen size" },
    ],
    example: "Find magnification for image=5mm, actual=0.05mm",
  },
  {
    id: 709,
    title: "Body Mass Index",
    subject: "Biology",
    category: "Human Physiology",
    level: "Foundational",
    formula: "BMI = \\frac{\\text{Weight (kg)}}{\\text{Height (m)}^2}",
    explanation: "Estimates body fat based on weight and height.",
    variables: [
      { symbol: "—", meaning: "weight in kilograms and height in metres" },
    ],
    example: "Find BMI for weight=70kg, height=1.75m",
  },
  {
    id: 710,
    title: "Rate of Enzyme Activity",
    subject: "Biology",
    category: "Biochemistry",
    level: "University",
    formula: "\\text{Rate} = \\frac{\\text{Product Formed}}{\\text{Time}}",
    explanation: "Measures how quickly an enzyme converts substrate into product.",
    variables: [
      { symbol: "—", meaning: "amount of product formed and time taken" },
    ],
    example: "Find rate for 2mg product formed in 5 minutes",
  },
  {
    id: 711,
    title: "Genetic Ratio (Monohybrid Cross)",
    subject: "Biology",
    category: "Genetics",
    level: "Foundational",
    formula: "\\text{Phenotypic Ratio} = 3:1",
    explanation: "Describes the expected ratio of dominant to recessive phenotypes in a monohybrid cross.",
    variables: [
      { symbol: "—", meaning: "offspring phenotype counts" },
    ],
    example: "Predict phenotype ratio for Aa × Aa cross",
  },
  {
    id: 805,
    title: "Genetic Cross Dihybrid Ratio",
    subject: "Biology",
    category: "Genetics",
    level: "University",
    formula: "\\text{Phenotypic Ratio} = 9:3:3:1",
    explanation: "Describes the expected phenotype ratio in a dihybrid cross of two heterozygotes.",
    variables: [
      { symbol: "—", meaning: "offspring counts across four phenotype classes" },
    ],
    example: "Predict phenotype ratio for AaBb × AaBb cross",
  },
  {
    id: 806,
    title: "Photosynthesis Rate (Light-Limited)",
    subject: "Biology",
    category: "Plant Physiology",
    level: "University",
    formula: "\\text{Rate} = \\frac{\\text{O}_2\\text{ Produced}}{\\text{Time}}",
    explanation: "Measures the rate of photosynthesis from oxygen output over time.",
    variables: [
      { symbol: "—", meaning: "volume of oxygen produced and time elapsed" },
    ],
    example: "Find rate for 15cm³ O2 produced in 5 minutes",
  },
  // =========================
  // ECONOMICS (new)
  // =========================
  {
    id: 712,
    title: "Cross Elasticity of Demand",
    subject: "Economics",
    category: "Microeconomics",
    level: "University",
    formula: "XED = \\frac{\\%\\Delta Q_{dA}}{\\%\\Delta P_B}",
    explanation: "Measures how demand for one good responds to a price change in another good.",
    variables: [
      { symbol: "\\%\\Delta Q_{dA}", meaning: "% change in quantity demanded of good A" },
      { symbol: "\\%\\Delta P_B", meaning: "% change in price of good B" },
    ],
    example: "Find XED for tea demand rising 8% when coffee price rises 10%",
  },
  {
    id: 713,
    title: "GDP Per Capita",
    subject: "Economics",
    category: "Macroeconomics",
    level: "Foundational",
    formula: "GDP_{pc} = \\frac{GDP}{\\text{Population}}",
    explanation: "Measures average economic output per person in a country.",
    variables: [
      { symbol: "GDP", meaning: "gross domestic product" },
      { symbol: "\\text{Population}", meaning: "total population" },
    ],
    example: "Find GDP per capita for GDP=$500bn, population=50 million",
  },
  {
    id: 714,
    title: "Keynesian Multiplier",
    subject: "Economics",
    category: "Macroeconomics",
    level: "University",
    formula: "k = \\frac{1}{1-MPC}",
    explanation: "Measures how much national income changes for a given change in spending.",
    variables: [
      { symbol: "MPC", meaning: "marginal propensity to consume" },
    ],
    example: "Find multiplier for MPC=0.75",
  },
  {
    id: 715,
    title: "Total Revenue (Economics)",
    subject: "Economics",
    category: "Microeconomics",
    level: "Foundational",
    formula: "TR = P\\times Q",
    explanation: "Calculates the total income received from sales.",
    variables: [
      { symbol: "P", meaning: "price per unit" },
      { symbol: "Q", meaning: "quantity sold" },
    ],
    example: "Find TR for P=₦200, Q=50 units",
  },
  {
    id: 716,
    title: "Average Cost",
    subject: "Economics",
    category: "Microeconomics",
    level: "Foundational",
    formula: "AC = \\frac{TC}{Q}",
    explanation: "Calculates the cost per unit of output produced.",
    variables: [
      { symbol: "TC", meaning: "total cost" },
      { symbol: "Q", meaning: "quantity produced" },
    ],
    example: "Find AC for TC=₦10,000, Q=100 units",
  },
  {
    id: 717,
    title: "Marginal Cost",
    subject: "Economics",
    category: "Microeconomics",
    level: "University",
    formula: "MC = \\frac{\\Delta TC}{\\Delta Q}",
    explanation: "Measures the cost of producing one additional unit of output.",
    variables: [
      { symbol: "\\Delta TC", meaning: "change in total cost" },
      { symbol: "\\Delta Q", meaning: "change in quantity" },
    ],
    example: "Find MC for ΔTC=₦500, ΔQ=10 units",
  },
  {
    id: 718,
    title: "Real GDP (Inflation Adjusted)",
    subject: "Economics",
    category: "Macroeconomics",
    level: "University",
    formula: "\\text{Real GDP} = \\frac{\\text{Nominal GDP}}{\\text{GDP Deflator}}\\times 100",
    explanation: "Adjusts nominal GDP for changes in the price level.",
    variables: [
      { symbol: "\\text{Nominal GDP}", meaning: "GDP at current prices" },
      { symbol: "\\text{GDP Deflator}", meaning: "price index for GDP" },
    ],
    example: "Find real GDP for nominal GDP=₦500bn, deflator=125",
  },
  {
    id: 719,
    title: "Exchange Rate Conversion",
    subject: "Economics",
    category: "International Trade",
    level: "Foundational",
    formula: "\\text{Foreign Value} = \\text{Domestic Value}\\times \\text{Exchange Rate}",
    explanation: "Converts an amount from domestic to foreign currency.",
    variables: [
      { symbol: "\\text{Exchange Rate}", meaning: "units of foreign currency per unit domestic currency" },
    ],
    example: "Convert ₦100,000 to USD at rate $1=₦1500",
  },
  {
    id: 817,
    title: "Rule of 70 (Doubling Time)",
    subject: "Economics",
    category: "Macroeconomics",
    level: "Foundational",
    formula: "\\text{Doubling Time} \\approx \\frac{70}{\\text{Growth Rate }\\%}",
    explanation: "Estimates how long it takes a quantity to double at a constant growth rate.",
    variables: [
      { symbol: "—", meaning: "annual percentage growth rate" },
    ],
    example: "Find doubling time for an economy growing at 5% per year",
  },
  {
    id: 818,
    title: "Lorenz Curve Gini Coefficient (Approx.)",
    subject: "Economics",
    category: "Macroeconomics",
    level: "University",
    formula: "G = \\frac{A}{A+B}",
    explanation: "Measures income inequality within a population using the Lorenz curve.",
    variables: [
      { symbol: "A", meaning: "area between line of equality and Lorenz curve" },
      { symbol: "B", meaning: "area under the Lorenz curve" },
    ],
    example: "Estimate Gini coefficient from a country's Lorenz curve data",
  },
  // =========================
  // ACCOUNTING (new)
  // =========================
  {
    id: 720,
    title: "Depreciation (Straight Line Method)",
    subject: "Accounting",
    category: "Fixed Assets",
    level: "Foundational",
    formula: "\\text{Depreciation} = \\frac{\\text{Cost} - \\text{Salvage Value}}{\\text{Useful Life}}",
    explanation: "Calculates the annual depreciation expense of an asset.",
    variables: [
      { symbol: "—", meaning: "cost, salvage value, and useful life of the asset" },
    ],
    example: "Find annual depreciation for cost=₦1,000,000, salvage=₦100,000, life=10 years",
  },
  {
    id: 721,
    title: "Depreciation (Reducing Balance Method)",
    subject: "Accounting",
    category: "Fixed Assets",
    level: "University",
    formula: "D = NBV\\times r",
    explanation: "Calculates depreciation as a fixed percentage of the reducing net book value.",
    variables: [
      { symbol: "NBV", meaning: "net book value" },
      { symbol: "r", meaning: "depreciation rate" },
    ],
    example: "Find depreciation for NBV=₦500,000, r=20%",
  },
  {
    id: 728,
    title: "Break-Even Point (Sales Value)",
    subject: "Accounting",
    category: "Cost Accounting",
    level: "University",
    formula: "BEP_{sales} = \\frac{\\text{Fixed Cost}}{\\text{Contribution Margin Ratio}}",
    explanation: "Calculates the sales revenue required to break even.",
    variables: [
      { symbol: "—", meaning: "fixed cost and contribution margin ratio" },
    ],
    example: "Find BEP sales for fixed cost=₦200,000, contribution margin ratio=0.4",
  },
  {
    id: 729,
    title: "Debt to Equity Ratio",
    subject: "Accounting",
    category: "Financial Ratios",
    level: "University",
    formula: "D/E = \\frac{\\text{Total Liabilities}}{\\text{Shareholders' Equity}}",
    explanation: "Measures a company's financial leverage.",
    variables: [
      { symbol: "—", meaning: "total liabilities and shareholders' equity" },
    ],
    example: "Find D/E ratio for liabilities=₦2,000,000, equity=₦4,000,000",
  },
  {
    id: 793,
    title: "Weighted Average Cost of Capital (WACC)",
    subject: "Accounting",
    category: "Corporate Finance",
    level: "University",
    formula: "WACC = \\frac{E}{V}r_e + \\frac{D}{V}r_d(1-T)",
    explanation: "Calculates a firm's average cost of financing from equity and debt.",
    variables: [
      { symbol: "E,D", meaning: "market value of equity and debt" },
      { symbol: "V", meaning: "total value (E+D)" },
      { symbol: "r_e,r_d", meaning: "cost of equity and debt" },
      { symbol: "T", meaning: "tax rate" },
    ],
    example: "Find WACC for E=₦6m, D=₦4m, re=12%, rd=8%, T=30%",
  },
  {
    id: 794,
    title: "Net Present Value",
    subject: "Accounting",
    category: "Corporate Finance",
    level: "University",
    formula: "NPV = \\sum_{t=1}^{n}\\frac{CF_t}{(1+r)^t} - C_0",
    explanation: "Calculates the present value of future cash flows minus the initial investment.",
    variables: [
      { symbol: "CF_t", meaning: "cash flow in period t" },
      { symbol: "r", meaning: "discount rate" },
      { symbol: "C_0", meaning: "initial investment" },
    ],
    example: "Find NPV of a project with given cash flows and 10% discount rate",
  },
  {
    id: 795,
    title: "Internal Rate of Return (Approximation)",
    subject: "Accounting",
    category: "Corporate Finance",
    level: "University",
    formula: "0 = \\sum_{t=1}^{n}\\frac{CF_t}{(1+IRR)^t} - C_0",
    explanation: "Finds the discount rate that makes NPV of a project equal to zero.",
    variables: [
      { symbol: "CF_t", meaning: "cash flow in period t" },
      { symbol: "C_0", meaning: "initial investment" },
    ],
    example: "Estimate IRR for a project's cash flow schedule",
  },
  {
    id: 796,
    title: "Payback Period",
    subject: "Accounting",
    category: "Corporate Finance",
    level: "Foundational",
    formula: "\\text{Payback Period} = \\frac{\\text{Initial Investment}}{\\text{Annual Cash Inflow}}",
    explanation: "Calculates the time required to recover an initial investment.",
    variables: [
      { symbol: "—", meaning: "initial investment and annual cash inflow" },
    ],
    example: "Find payback period for investment=₦500,000, annual inflow=₦100,000",
  },
  {
    id: 797,
    title: "Inventory Turnover Ratio",
    subject: "Accounting",
    category: "Financial Ratios",
    level: "University",
    formula: "\\text{Inventory Turnover} = \\frac{\\text{Cost of Goods Sold}}{\\text{Average Inventory}}",
    explanation: "Measures how many times inventory is sold and replaced over a period.",
    variables: [
      { symbol: "—", meaning: "cost of goods sold and average inventory" },
    ],
    example: "Find turnover for COGS=₦900,000, average inventory=₦150,000",
  },
  {
    id: 798,
    title: "Earnings Per Share",
    subject: "Accounting",
    category: "Financial Ratios",
    level: "University",
    formula: "EPS = \\frac{\\text{Net Income} - \\text{Preferred Dividends}}{\\text{Weighted Average Shares Outstanding}}",
    explanation: "Measures the profit allocated to each outstanding share of common stock.",
    variables: [
      { symbol: "—", meaning: "net income, preferred dividends, and shares outstanding" },
    ],
    example: "Find EPS for net income=₦10m, preferred dividends=₦1m, shares=3m",
  },
  {
    id: 799,
    title: "Price-Earnings Ratio",
    subject: "Accounting",
    category: "Financial Ratios",
    level: "University",
    formula: "P/E = \\frac{\\text{Market Price per Share}}{\\text{Earnings per Share}}",
    explanation: "Measures how much investors pay per unit of company earnings.",
    variables: [
      { symbol: "—", meaning: "market price per share and EPS" },
    ],
    example: "Find P/E for price=₦50, EPS=₦5",
  },
  {
    id: 816,
    title: "Economic Order Quantity",
    subject: "Accounting",
    category: "Cost Accounting",
    level: "University",
    formula: "EOQ = \\sqrt{\\frac{2DS}{H}}",
    explanation: "Calculates the order quantity that minimizes total inventory costs.",
    variables: [
      { symbol: "D", meaning: "annual demand" },
      { symbol: "S", meaning: "ordering cost per order" },
      { symbol: "H", meaning: "holding cost per unit" },
    ],
    example: "Find EOQ for D=10000 units, S=₦50, H=₦2",
  },
  // =========================
  // COMMERCE (new)
  // =========================
  {
    id: 722,
    title: "Margin (Profit Margin)",
    subject: "Commerce",
    category: "Trade",
    level: "University",
    formula: "\\text{Margin} = \\frac{\\text{Profit}}{\\text{Selling Price}}\\times 100",
    explanation: "Expresses profit as a percentage of selling price.",
    variables: [
      { symbol: "—", meaning: "profit and selling price" },
    ],
    example: "Find margin for profit=₦500, selling price=₦2,500",
  },
  {
    id: 723,
    title: "Future Value (Compound Interest)",
    subject: "Commerce",
    category: "Financial Mathematics",
    level: "University",
    formula: "FV = PV(1+r)^n",
    explanation: "Calculates the future value of a present sum invested at compound interest.",
    variables: [
      { symbol: "PV", meaning: "present value" },
      { symbol: "r", meaning: "interest rate" },
      { symbol: "n", meaning: "number of periods" },
    ],
    example: "Find FV for PV=₦100,000, r=8%, n=5 years",
  },
  {
    id: 724,
    title: "Present Value",
    subject: "Commerce",
    category: "Financial Mathematics",
    level: "University",
    formula: "PV = \\frac{FV}{(1+r)^n}",
    explanation: "Calculates the current worth of a future sum of money.",
    variables: [
      { symbol: "FV", meaning: "future value" },
      { symbol: "r", meaning: "discount rate" },
      { symbol: "n", meaning: "number of periods" },
    ],
    example: "Find PV for FV=₦200,000, r=10%, n=3 years",
  },
  {
    id: 725,
    title: "Annuity Present Value",
    subject: "Commerce",
    category: "Financial Mathematics",
    level: "University",
    formula: "PV = A\\times \\frac{1-(1+r)^{-n}}{r}",
    explanation: "Calculates the present value of a series of equal periodic payments.",
    variables: [
      { symbol: "A", meaning: "periodic payment" },
      { symbol: "r", meaning: "interest rate per period" },
      { symbol: "n", meaning: "number of periods" },
    ],
    example: "Find PV of ₦10,000 annual payments for 5 years at 6%",
  },
  {
    id: 726,
    title: "Loan Amortization Payment",
    subject: "Commerce",
    category: "Financial Mathematics",
    level: "University",
    formula: "A = P\\times\\frac{r(1+r)^n}{(1+r)^n-1}",
    explanation: "Calculates the fixed periodic payment needed to repay a loan.",
    variables: [
      { symbol: "P", meaning: "principal loan amount" },
      { symbol: "r", meaning: "interest rate per period" },
      { symbol: "n", meaning: "number of payments" },
    ],
    example: "Find monthly payment for a ₦1,000,000 loan at 1% monthly over 12 months",
  },
  {
    id: 727,
    title: "Hire Purchase Total Cost",
    subject: "Commerce",
    category: "Trade",
    level: "Foundational",
    formula: "\\text{Total HP Price} = \\text{Deposit} + (\\text{Instalment}\\times \\text{Number of Instalments})",
    explanation: "Calculates the total amount paid under a hire purchase agreement.",
    variables: [
      { symbol: "—", meaning: "deposit, instalment amount, and number of instalments" },
    ],
    example: "Find total HP price for deposit=₦20,000, instalment=₦5,000×12",
  },
  {
    id: 781,
    title: "Insurance Premium (Risk-Based)",
    subject: "Commerce",
    category: "Insurance",
    level: "University",
    formula: "\\text{Premium} = \\text{Sum Insured}\\times \\text{Premium Rate}",
    explanation: "Calculates the cost of an insurance policy based on coverage amount and rate.",
    variables: [
      { symbol: "—", meaning: "sum insured and premium rate" },
    ],
    example: "Find premium for sum insured=₦5,000,000 at rate 2%",
  },
  {
    id: 782,
    title: "Loss Ratio (Insurance)",
    subject: "Commerce",
    category: "Insurance",
    level: "University",
    formula: "\\text{Loss Ratio} = \\frac{\\text{Claims Paid}}{\\text{Premiums Earned}}",
    explanation: "Measures an insurer's claims expense relative to premium income.",
    variables: [
      { symbol: "—", meaning: "total claims paid and premiums earned" },
    ],
    example: "Find loss ratio for claims=₦2,000,000, premiums=₦5,000,000",
  },
  {
    id: 800,
    title: "Effective Annual Rate",
    subject: "Commerce",
    category: "Financial Mathematics",
    level: "University",
    formula: "EAR = \\left(1+\\frac{r}{n}\\right)^n - 1",
    explanation: "Calculates the true annual interest rate accounting for compounding frequency.",
    variables: [
      { symbol: "r", meaning: "nominal annual rate" },
      { symbol: "n", meaning: "compounding periods per year" },
    ],
    example: "Find EAR for r=12%, compounded monthly",
  },
  {
    id: 801,
    title: "Amortization Outstanding Balance",
    subject: "Commerce",
    category: "Financial Mathematics",
    level: "University",
    formula: "B_t = P(1+r)^t - A\\frac{(1+r)^t-1}{r}",
    explanation: "Calculates the remaining loan balance after t payments.",
    variables: [
      { symbol: "P", meaning: "original principal" },
      { symbol: "A", meaning: "periodic payment" },
      { symbol: "r", meaning: "interest rate per period" },
      { symbol: "t", meaning: "number of payments made" },
    ],
    example: "Find balance after 12 payments on a 5-year loan",
  },
  // =========================
  // COMPUTER SCIENCE (new)
  // =========================
  {
    id: 730,
    title: "Storage Capacity Conversion",
    subject: "Computer Science",
    category: "Data Representation",
    level: "Foundational",
    formula: "1\\ \\text{KB} = 2^{10}\\ \\text{Bytes}",
    explanation: "Converts between units of digital storage capacity.",
    variables: [
      { symbol: "—", meaning: "binary storage unit relationship" },
    ],
    example: "Convert 5MB to bytes",
  },
  {
    id: 731,
    title: "Time Complexity - Big O Notation",
    subject: "Computer Science",
    category: "Algorithms",
    level: "University",
    formula: "T(n) = O(f(n))",
    explanation: "Describes the upper bound growth rate of an algorithm's running time.",
    variables: [
      { symbol: "T(n)", meaning: "running time as a function of input size" },
      { symbol: "f(n)", meaning: "bounding function" },
    ],
    example: "Classify time complexity of a linear search algorithm",
  },
  {
    id: 732,
    title: "IP Subnet Host Count",
    subject: "Computer Science",
    category: "Networking",
    level: "University",
    formula: "\\text{Hosts} = 2^{(32-\\text{Prefix})} - 2",
    explanation: "Calculates the number of usable host addresses in an IPv4 subnet.",
    variables: [
      { symbol: "\\text{Prefix}", meaning: "subnet mask prefix length" },
    ],
    example: "Find usable hosts for a /24 subnet",
  },
  {
    id: 733,
    title: "Boolean AND/OR Basic Identity",
    subject: "Computer Science",
    category: "Boolean Algebra",
    level: "University",
    formula: "A + \\bar{A} = 1,\\ A\\cdot \\bar{A} = 0",
    explanation: "States the complement laws of Boolean algebra.",
    variables: [
      { symbol: "A", meaning: "Boolean variable" },
    ],
    example: "Simplify expression using complement laws",
  },
  {
    id: 734,
    title: "De Morgan's Theorem",
    subject: "Computer Science",
    category: "Boolean Algebra",
    level: "University",
    formula: "\\overline{A+B} = \\bar{A}\\cdot\\bar{B}",
    explanation: "Relates the complement of a sum to the product of complements.",
    variables: [
      { symbol: "A,B", meaning: "Boolean variables" },
    ],
    example: "Simplify NOT(A OR B) using De Morgan's theorem",
  },
  {
    id: 735,
    title: "Hashing Load Factor",
    subject: "Computer Science",
    category: "Data Structures",
    level: "University",
    formula: "\\alpha = \\frac{n}{m}",
    explanation: "Measures how full a hash table is.",
    variables: [
      { symbol: "n", meaning: "number of stored entries" },
      { symbol: "m", meaning: "number of buckets" },
    ],
    example: "Find load factor for 80 entries in 100 buckets",
  },
  {
    id: 736,
    title: "Frame Rate to Playback Time",
    subject: "Computer Science",
    category: "Multimedia",
    level: "Foundational",
    formula: "t = \\frac{\\text{Number of Frames}}{\\text{Frame Rate}}",
    explanation: "Calculates video duration from frame count and frame rate.",
    variables: [
      { symbol: "—", meaning: "total frames and frames per second" },
    ],
    example: "Find duration for 1800 frames at 30fps",
  },
  {
    id: 807,
    title: "Signal-to-Noise Ratio",
    subject: "Computer Science",
    category: "Signal Processing",
    level: "University",
    formula: "SNR_{dB} = 10\\log_{10}\\left(\\frac{P_{signal}}{P_{noise}}\\right)",
    explanation: "Measures signal quality relative to background noise in decibels.",
    variables: [
      { symbol: "P_{signal}", meaning: "signal power" },
      { symbol: "P_{noise}", meaning: "noise power" },
    ],
    example: "Find SNR for signal power=100mW, noise power=1mW",
  },
  {
    id: 808,
    title: "Nyquist Sampling Rate",
    subject: "Computer Science",
    category: "Signal Processing",
    level: "University",
    formula: "f_s \\geq 2f_{max}",
    explanation: "States the minimum sampling rate needed to accurately reconstruct a signal.",
    variables: [
      { symbol: "f_{max}", meaning: "highest frequency component of the signal" },
    ],
    example: "Find minimum sampling rate for a 4kHz audio signal",
  },
  {
    id: 809,
    title: "Shannon Channel Capacity",
    subject: "Computer Science",
    category: "Networking",
    level: "University",
    formula: "C = B\\log_2(1+SNR)",
    explanation: "Calculates the maximum data rate of a communication channel.",
    variables: [
      { symbol: "B", meaning: "channel bandwidth" },
      { symbol: "SNR", meaning: "signal-to-noise ratio" },
    ],
    example: "Find channel capacity for B=3kHz, SNR=1000",
  },
  // =========================
  // CIVIL ENGINEERING (new)
  // =========================
  {
    id: 737,
    title: "Bending Stress",
    subject: "Civil Engineering",
    category: "Structural Analysis",
    level: "University",
    formula: "\\sigma = \\frac{My}{I}",
    explanation: "Calculates the stress in a beam due to bending moment.",
    variables: [
      { symbol: "M", meaning: "bending moment" },
      { symbol: "y", meaning: "distance from neutral axis" },
      { symbol: "I", meaning: "moment of inertia" },
    ],
    example: "Find bending stress for M=5000Nm, y=0.1m, I=8×10⁻⁶m⁴",
  },
  {
    id: 738,
    title: "Shear Stress",
    subject: "Civil Engineering",
    category: "Structural Analysis",
    level: "University",
    formula: "\\tau = \\frac{F}{A}",
    explanation: "Calculates the shear stress in a material due to applied force.",
    variables: [
      { symbol: "F", meaning: "shear force" },
      { symbol: "A", meaning: "cross-sectional area" },
    ],
    example: "Find shear stress for F=2000N, A=0.01m²",
  },
  {
    id: 739,
    title: "Strain",
    subject: "Civil Engineering",
    category: "Structural Analysis",
    level: "Foundational",
    formula: "\\epsilon = \\frac{\\Delta L}{L_0}",
    explanation: "Measures the deformation of a material relative to its original length.",
    variables: [
      { symbol: "\\Delta L", meaning: "change in length" },
      { symbol: "L_0", meaning: "original length" },
    ],
    example: "Find strain for ΔL=2mm, L0=1000mm",
  },
  {
    id: 740,
    title: "Beam Deflection (Simply Supported, Point Load)",
    subject: "Civil Engineering",
    category: "Structural Analysis",
    level: "University",
    formula: "\\delta = \\frac{WL^3}{48EI}",
    explanation: "Calculates the maximum deflection of a simply supported beam under a central point load.",
    variables: [
      { symbol: "W", meaning: "point load" },
      { symbol: "L", meaning: "span length" },
      { symbol: "E", meaning: "Young's modulus" },
      { symbol: "I", meaning: "moment of inertia" },
    ],
    example: "Find deflection for W=1000N, L=4m, E=200GPa, I=8×10⁻⁶m⁴",
  },
  {
    id: 741,
    title: "Manning's Equation (Open Channel Flow)",
    subject: "Civil Engineering",
    category: "Hydraulics",
    level: "University",
    formula: "V = \\frac{1}{n}R^{2/3}S^{1/2}",
    explanation: "Estimates the velocity of flow in an open channel.",
    variables: [
      { symbol: "n", meaning: "Manning's roughness coefficient" },
      { symbol: "R", meaning: "hydraulic radius" },
      { symbol: "S", meaning: "channel slope" },
    ],
    example: "Find flow velocity for n=0.013, R=0.5m, S=0.001",
  },
  {
    id: 810,
    title: "Column Buckling Load (Euler's Formula)",
    subject: "Civil Engineering",
    category: "Structural Analysis",
    level: "University",
    formula: "P_{cr} = \\frac{\\pi^2 EI}{L^2}",
    explanation: "Calculates the critical axial load at which a slender column buckles.",
    variables: [
      { symbol: "E", meaning: "Young's modulus" },
      { symbol: "I", meaning: "moment of inertia" },
      { symbol: "L", meaning: "effective column length" },
    ],
    example: "Find critical load for a steel column, E=200GPa, I=8×10⁻⁶m⁴, L=3m",
  },
  // =========================
  // MECHANICAL ENGINEERING (new)
  // =========================
  {
    id: 742,
    title: "Torque-Power Relation for Rotating Shaft",
    subject: "Mechanical Engineering",
    category: "Machines",
    level: "University",
    formula: "P = \\tau\\omega",
    explanation: "Relates power transmitted to torque and angular velocity of a shaft.",
    variables: [
      { symbol: "\\tau", meaning: "torque" },
      { symbol: "\\omega", meaning: "angular velocity" },
    ],
    example: "Find power for torque=50Nm, ω=100rad/s",
  },
  {
    id: 744,
    title: "Stress-Strain (Poisson's Ratio)",
    subject: "Mechanical Engineering",
    category: "Materials Science",
    level: "University",
    formula: "\\nu = -\\frac{\\epsilon_{lateral}}{\\epsilon_{axial}}",
    explanation: "Measures the ratio of lateral to axial strain in a stretched material.",
    variables: [
      { symbol: "\\epsilon_{lateral}", meaning: "lateral strain" },
      { symbol: "\\epsilon_{axial}", meaning: "axial strain" },
    ],
    example: "Find Poisson's ratio for a stretched steel rod",
  },
  {
    id: 745,
    title: "Fatigue - Endurance Limit Estimation",
    subject: "Mechanical Engineering",
    category: "Materials Science",
    level: "University",
    formula: "S_e \\approx 0.5\\, S_{ut}",
    explanation: "Estimates the fatigue endurance limit of steel from ultimate tensile strength.",
    variables: [
      { symbol: "S_{ut}", meaning: "ultimate tensile strength" },
    ],
    example: "Estimate endurance limit for steel with Sut=600MPa",
  },
  {
    id: 811,
    title: "Factor of Safety",
    subject: "Mechanical Engineering",
    category: "Materials Science",
    level: "Foundational",
    formula: "FoS = \\frac{\\text{Ultimate Stress}}{\\text{Working Stress}}",
    explanation: "Measures the safety margin of a design against material failure.",
    variables: [
      { symbol: "—", meaning: "ultimate stress and actual working stress" },
    ],
    example: "Find FoS for ultimate stress=400MPa, working stress=100MPa",
  },
  // =========================
  // THERMODYNAMICS (new)
  // =========================
  {
    id: 743,
    title: "Thermal Efficiency of a Heat Engine",
    subject: "Thermodynamics",
    category: "Heat Engines",
    level: "University",
    formula: "\\eta = 1 - \\frac{T_C}{T_H}",
    explanation: "Calculates the maximum theoretical efficiency of a heat engine (Carnot).",
    variables: [
      { symbol: "T_C", meaning: "cold reservoir temperature (K)" },
      { symbol: "T_H", meaning: "hot reservoir temperature (K)" },
    ],
    example: "Find efficiency for TH=600K, TC=300K",
  },
  // =========================
  // ELECTRICAL ENGINEERING (new)
  // =========================
  {
    id: 746,
    title: "Three-Phase Power (Balanced Load)",
    subject: "Electrical Engineering",
    category: "AC Circuits",
    level: "University",
    formula: "P = \\sqrt{3}V_LI_L\\cos\\phi",
    explanation: "Calculates total real power in a balanced three-phase system.",
    variables: [
      { symbol: "V_L", meaning: "line voltage" },
      { symbol: "I_L", meaning: "line current" },
      { symbol: "\\cos\\phi", meaning: "power factor" },
    ],
    example: "Find power for VL=415V, IL=20A, cosφ=0.9",
  },
  {
    id: 747,
    title: "Impedance of RLC Series Circuit",
    subject: "Electrical Engineering",
    category: "AC Circuits",
    level: "University",
    formula: "Z = \\sqrt{R^2+(X_L-X_C)^2}",
    explanation: "Calculates total opposition to current in a series RLC circuit.",
    variables: [
      { symbol: "R", meaning: "resistance" },
      { symbol: "X_L,X_C", meaning: "inductive and capacitive reactance" },
    ],
    example: "Find Z for R=30Ω, XL=40Ω, XC=10Ω",
  },
  {
    id: 748,
    title: "Resonant Frequency of RLC Circuit",
    subject: "Electrical Engineering",
    category: "AC Circuits",
    level: "University",
    formula: "f_0 = \\frac{1}{2\\pi\\sqrt{LC}}",
    explanation: "Calculates the frequency at which an RLC circuit resonates.",
    variables: [
      { symbol: "L", meaning: "inductance" },
      { symbol: "C", meaning: "capacitance" },
    ],
    example: "Find resonant frequency for L=0.5H, C=20μF",
  },
  // =========================
  // GEOGRAPHY (new)
  // =========================
  {
    id: 749,
    title: "Vertical Exaggeration (Map Cross-Section)",
    subject: "Geography",
    category: "Map Reading",
    level: "University",
    formula: "VE = \\frac{\\text{Vertical Scale}}{\\text{Horizontal Scale}}",
    explanation: "Measures how much the vertical scale of a cross-section is exaggerated relative to horizontal scale.",
    variables: [
      { symbol: "—", meaning: "vertical and horizontal scales used" },
    ],
    example: "Find VE for vertical scale 1:1000, horizontal scale 1:50000",
  },
  {
    id: 750,
    title: "Gradient (Geography)",
    subject: "Geography",
    category: "Map Reading",
    level: "Foundational",
    formula: "\\text{Gradient} = \\frac{\\text{Vertical Interval}}{\\text{Horizontal Equivalent}}",
    explanation: "Calculates the steepness of a slope between two points on a map.",
    variables: [
      { symbol: "—", meaning: "vertical rise and horizontal distance" },
    ],
    example: "Find gradient for VI=100m, HE=2000m",
  },
  {
    id: 751,
    title: "Dependency Ratio",
    subject: "Geography",
    category: "Population Geography",
    level: "University",
    formula: "DR = \\frac{\\text{Population under 15}+\\text{Population over 64}}{\\text{Population 15-64}}\\times 100",
    explanation: "Measures the economic burden of dependents on the working-age population.",
    variables: [
      { symbol: "—", meaning: "population figures by age group" },
    ],
    example: "Find dependency ratio from a population age breakdown",
  },
  {
    id: 752,
    title: "Richter Magnitude Scale",
    subject: "Geography",
    category: "Geomorphology",
    level: "University",
    formula: "M = \\log_{10}(A) - \\log_{10}(A_0)",
    explanation: "Measures the magnitude of an earthquake from seismograph amplitude.",
    variables: [
      { symbol: "A", meaning: "amplitude of seismic wave" },
      { symbol: "A_0", meaning: "reference amplitude" },
    ],
    example: "Find magnitude given amplitude readings",
  },
  // =========================
  // AGRICULTURAL SCIENCE (new)
  // =========================
  {
    id: 753,
    title: "Crop Yield",
    subject: "Agricultural Science",
    category: "Crop Production",
    level: "Foundational",
    formula: "\\text{Yield} = \\frac{\\text{Total Output}}{\\text{Land Area}}",
    explanation: "Measures the quantity of crop produced per unit land area.",
    variables: [
      { symbol: "—", meaning: "total crop output and land area cultivated" },
    ],
    example: "Find yield for 5,000kg maize from 2 hectares",
  },
  {
    id: 754,
    title: "Farm Income Ratio",
    subject: "Agricultural Science",
    category: "Farm Management",
    level: "University",
    formula: "\\text{FIR} = \\frac{\\text{Net Farm Income}}{\\text{Gross Farm Income}}",
    explanation: "Measures the proportion of gross income retained as net income on a farm.",
    variables: [
      { symbol: "—", meaning: "net and gross farm income" },
    ],
    example: "Find FIR for net income=₦300,000, gross income=₦800,000",
  },
  {
    id: 815,
    title: "Land Capability Index",
    subject: "Agricultural Science",
    category: "Soil Science",
    level: "University",
    formula: "LCI = \\frac{\\text{Actual Yield}}{\\text{Potential Yield}}\\times 100",
    explanation: "Measures how close actual crop yield is to the land's potential yield.",
    variables: [
      { symbol: "—", meaning: "actual and potential yield of the land" },
    ],
    example: "Find LCI for actual yield=3000kg/ha, potential=4000kg/ha",
  },
  // =========================
  // HEALTH EDUCATION (new)
  // =========================
  {
    id: 755,
    title: "Body Surface Area (Mosteller Formula)",
    subject: "Health Education",
    category: "Fitness Assessment",
    level: "University",
    formula: "BSA = \\sqrt{\\frac{\\text{Height}\\times\\text{Weight}}{3600}}",
    explanation: "Estimates body surface area from height and weight.",
    variables: [
      { symbol: "—", meaning: "height in cm and weight in kg" },
    ],
    example: "Find BSA for height=170cm, weight=70kg",
  },
  {
    id: 756,
    title: "Basal Metabolic Rate (Harris-Benedict, Male)",
    subject: "Health Education",
    category: "Exercise Physiology",
    level: "University",
    formula: "BMR = 88.4 + (13.4\\times W) + (4.8\\times H) - (5.68\\times A)",
    explanation: "Estimates the basal metabolic rate for men based on weight, height, and age.",
    variables: [
      { symbol: "W", meaning: "weight in kg" },
      { symbol: "H", meaning: "height in cm" },
      { symbol: "A", meaning: "age in years" },
    ],
    example: "Find BMR for W=70kg, H=175cm, A=25",
  },
  {
    id: 757,
    title: "VO2 Max Estimate (Cooper Test)",
    subject: "Health Education",
    category: "Exercise Physiology",
    level: "University",
    formula: "VO_2max = \\frac{\\text{Distance (m)} - 504.9}{44.73}",
    explanation: "Estimates aerobic fitness from distance covered in a 12-minute run.",
    variables: [
      { symbol: "\\text{Distance}", meaning: "distance covered in 12 minutes" },
    ],
    example: "Find VO2 max for 2400m covered in 12 minutes",
  },
  {
    id: 778,
    title: "Drug Dosage Calculation",
    subject: "Health Education",
    category: "Pharmacology",
    level: "University",
    formula: "\\text{Dose} = \\frac{\\text{Prescribed Dose}}{\\text{Stock Strength}}\\times \\text{Volume}",
    explanation: "Calculates the volume of medication to administer from a prescribed dose and stock concentration.",
    variables: [
      { symbol: "—", meaning: "prescribed dose, stock strength, and stock volume" },
    ],
    example: "Find dose for prescribed=250mg, stock=500mg/5mL",
  },
  {
    id: 779,
    title: "IV Drip Rate",
    subject: "Health Education",
    category: "Nursing Calculations",
    level: "University",
    formula: "\\text{Drip Rate} = \\frac{\\text{Volume (mL)}\\times \\text{Drop Factor}}{\\text{Time (min)}}",
    explanation: "Calculates the flow rate for intravenous fluid administration.",
    variables: [
      { symbol: "—", meaning: "volume to infuse, drop factor, and infusion time" },
    ],
    example: "Find drip rate for 1000mL over 8 hours, drop factor=15",
  },
  {
    id: 780,
    title: "Mean Arterial Pressure",
    subject: "Health Education",
    category: "Human Physiology",
    level: "University",
    formula: "MAP = DP + \\frac{1}{3}(SP-DP)",
    explanation: "Estimates the average blood pressure during a cardiac cycle.",
    variables: [
      { symbol: "SP", meaning: "systolic pressure" },
      { symbol: "DP", meaning: "diastolic pressure" },
    ],
    example: "Find MAP for SP=120mmHg, DP=80mmHg",
  },
  // =========================
  // ENVIRONMENTAL SCIENCE (new)
  // =========================
  {
    id: 758,
    title: "Air Quality Index Contribution",
    subject: "Environmental Science",
    category: "Pollution",
    level: "University",
    formula: "AQI = \\frac{I_{high}-I_{low}}{C_{high}-C_{low}}(C-C_{low}) + I_{low}",
    explanation: "Converts a pollutant concentration into an Air Quality Index value.",
    variables: [
      { symbol: "C", meaning: "pollutant concentration" },
      { symbol: "I_{high},I_{low}", meaning: "AQI breakpoints" },
      { symbol: "C_{high},C_{low}", meaning: "concentration breakpoints" },
    ],
    example: "Find AQI for a given PM2.5 concentration",
  },
  {
    id: 759,
    title: "Carbon Footprint (Emissions)",
    subject: "Environmental Science",
    category: "Sustainability",
    level: "Foundational",
    formula: "\\text{CO}_2\\text{e} = \\text{Activity Data}\\times \\text{Emission Factor}",
    explanation: "Estimates greenhouse gas emissions from an activity.",
    variables: [
      { symbol: "\\text{Activity Data}", meaning: "quantity of fuel used or distance travelled" },
      { symbol: "\\text{Emission Factor}", meaning: "CO2 equivalent per unit activity" },
    ],
    example: "Find CO2e for 100L petrol used, factor=2.3kg CO2/L",
  },
  {
    id: 760,
    title: "Biochemical Oxygen Demand",
    subject: "Environmental Science",
    category: "Water Quality",
    level: "University",
    formula: "BOD = D_1 - D_2",
    explanation: "Measures the amount of oxygen consumed by microorganisms in decomposing organic matter.",
    variables: [
      { symbol: "D_1", meaning: "initial dissolved oxygen" },
      { symbol: "D_2", meaning: "dissolved oxygen after incubation" },
    ],
    example: "Find BOD for D1=8mg/L, D2=3mg/L",
  },
  {
    id: 761,
    title: "Water Footprint",
    subject: "Environmental Science",
    category: "Sustainability",
    level: "Foundational",
    formula: "WF = \\text{Blue Water}+\\text{Green Water}+\\text{Grey Water}",
    explanation: "Measures total freshwater used directly and indirectly to produce goods.",
    variables: [
      { symbol: "—", meaning: "blue, green, and grey water components" },
    ],
    example: "Estimate water footprint of a crop production process",
  },
  // =========================
  // FURTHER MATHEMATICS (new)
  // =========================
  {
    id: 762,
    title: "Complex Number Argument",
    subject: "Further Mathematics",
    category: "Complex Numbers",
    level: "University",
    formula: "\\theta = \\tan^{-1}\\left(\\frac{b}{a}\\right)",
    explanation: "Calculates the angle a complex number makes with the positive real axis.",
    variables: [
      { symbol: "a,b", meaning: "real and imaginary parts of z=a+bi" },
    ],
    example: "Find argument of z=1+i",
  },
  {
    id: 763,
    title: "Sum of First n Natural Numbers",
    subject: "Further Mathematics",
    category: "Series",
    level: "Foundational",
    formula: "\\sum_{k=1}^{n}k = \\frac{n(n+1)}{2}",
    explanation: "Calculates the sum of the first n natural numbers.",
    variables: [
      { symbol: "n", meaning: "number of terms" },
    ],
    example: "Find sum of first 20 natural numbers",
  },
  {
    id: 764,
    title: "Sum of Squares of First n Natural Numbers",
    subject: "Further Mathematics",
    category: "Series",
    level: "University",
    formula: "\\sum_{k=1}^n k^2 = \\frac{n(n+1)(2n+1)}{6}",
    explanation: "Calculates the sum of squares of the first n natural numbers.",
    variables: [
      { symbol: "n", meaning: "number of terms" },
    ],
    example: "Find sum of squares of first 10 natural numbers",
  },
  {
    id: 765,
    title: "Matrix Transformation - Rotation",
    subject: "Further Mathematics",
    category: "Transformations",
    level: "University",
    formula: "R(\\theta) = \\begin{pmatrix}\\cos\\theta & -\\sin\\theta\\\\ \\sin\\theta & \\cos\\theta\\end{pmatrix}",
    explanation: "Represents a rotation of points about the origin by angle θ.",
    variables: [
      { symbol: "\\theta", meaning: "angle of rotation" },
    ],
    example: "Rotate point (2,0) by 90° about the origin",
  },
  {
    id: 766,
    title: "Kinematics - Projectile Range",
    subject: "Further Mathematics",
    category: "Mechanics",
    level: "University",
    formula: "R = \\frac{u^2\\sin 2\\theta}{g}",
    explanation: "Calculates the horizontal range of a projectile launched at an angle.",
    variables: [
      { symbol: "u", meaning: "initial speed" },
      { symbol: "\\theta", meaning: "launch angle" },
      { symbol: "g", meaning: "gravitational acceleration" },
    ],
    example: "Find range for u=20m/s, θ=45°",
  },
  {
    id: 767,
    title: "Kinematics - Maximum Height of Projectile",
    subject: "Further Mathematics",
    category: "Mechanics",
    level: "University",
    formula: "H = \\frac{u^2\\sin^2\\theta}{2g}",
    explanation: "Calculates the maximum height reached by a projectile.",
    variables: [
      { symbol: "u", meaning: "initial speed" },
      { symbol: "\\theta", meaning: "launch angle" },
      { symbol: "g", meaning: "gravitational acceleration" },
    ],
    example: "Find max height for u=20m/s, θ=30°",
  },
  {
    id: 768,
    title: "Simple Harmonic Motion - Period",
    subject: "Further Mathematics",
    category: "Mechanics",
    level: "University",
    formula: "T = 2\\pi\\sqrt{\\frac{m}{k}}",
    explanation: "Calculates the period of oscillation of a mass-spring system.",
    variables: [
      { symbol: "m", meaning: "mass" },
      { symbol: "k", meaning: "spring constant" },
    ],
    example: "Find period for m=0.5kg, k=20N/m",
  },
  {
    id: 769,
    title: "Simple Pendulum Period",
    subject: "Further Mathematics",
    category: "Mechanics",
    level: "University",
    formula: "T = 2\\pi\\sqrt{\\frac{l}{g}}",
    explanation: "Calculates the period of oscillation of a simple pendulum.",
    variables: [
      { symbol: "l", meaning: "length of pendulum" },
      { symbol: "g", meaning: "gravitational acceleration" },
    ],
    example: "Find period for l=1m",
  },
  // =========================
  // ASTRONOMY (new)
  // =========================
  {
    id: 770,
    title: "Apparent Magnitude-Distance Relation",
    subject: "Astronomy",
    category: "Stellar Astronomy",
    level: "University",
    formula: "m - M = 5\\log_{10}(d) - 5",
    explanation: "Relates a star's apparent and absolute magnitude to its distance.",
    variables: [
      { symbol: "m", meaning: "apparent magnitude" },
      { symbol: "M", meaning: "absolute magnitude" },
      { symbol: "d", meaning: "distance in parsecs" },
    ],
    example: "Find distance for m=5, M=1",
  },
  {
    id: 814,
    title: "Kepler's Second Law (Areal Velocity)",
    subject: "Astronomy",
    category: "Orbital Mechanics",
    level: "University",
    formula: "\\frac{dA}{dt} = \\text{constant}",
    explanation: "States that a planet sweeps out equal areas in equal times as it orbits the sun.",
    variables: [
      { symbol: "dA/dt", meaning: "rate of area swept by the radius vector" },
    ],
    example: "Compare areal velocity of a planet at perihelion and aphelion",
  },
  // =========================
  // ARCHITECTURE (new)
  // =========================
  {
    id: 771,
    title: "Staircase Rise-Run Rule",
    subject: "Architecture",
    category: "Building Design",
    level: "Foundational",
    formula: "2R + G = 600\\ \\text{mm (approx)}",
    explanation: "A rule of thumb relating stair riser height and going (tread depth) for comfortable stairs.",
    variables: [
      { symbol: "R", meaning: "riser height (mm)" },
      { symbol: "G", meaning: "going/tread depth (mm)" },
    ],
    example: "Check comfort of stairs with R=175mm, G=250mm",
  },
  {
    id: 772,
    title: "Floor Area Ratio",
    subject: "Architecture",
    category: "Urban Planning",
    level: "University",
    formula: "FAR = \\frac{\\text{Total Floor Area}}{\\text{Plot Area}}",
    explanation: "Measures building density by comparing total floor area to the size of the land parcel.",
    variables: [
      { symbol: "—", meaning: "total building floor area and plot area" },
    ],
    example: "Find FAR for floor area=6000m², plot=2000m²",
  },
  {
    id: 773,
    title: "Concrete Water-Cement Ratio",
    subject: "Architecture",
    category: "Building Materials",
    level: "Foundational",
    formula: "\\text{W/C Ratio} = \\frac{\\text{Weight of Water}}{\\text{Weight of Cement}}",
    explanation: "Determines the strength and workability of a concrete mix.",
    variables: [
      { symbol: "—", meaning: "weight of water and weight of cement used" },
    ],
    example: "Find W/C ratio for 20kg water, 50kg cement",
  },
  {
    id: 774,
    title: "Brick Quantity Estimation",
    subject: "Architecture",
    category: "Building Materials",
    level: "Foundational",
    formula: "\\text{Bricks} = \\frac{\\text{Wall Volume}}{\\text{Brick Volume + Mortar}}",
    explanation: "Estimates the number of bricks needed for a wall of given volume.",
    variables: [
      { symbol: "—", meaning: "wall volume and effective brick volume including mortar joint" },
    ],
    example: "Estimate bricks needed for a 10m³ wall",
  },
  // =========================
  // FOOD SCIENCE (new)
  // =========================
  {
    id: 775,
    title: "Caloric Value of Food",
    subject: "Food Science",
    category: "Nutrition",
    level: "Foundational",
    formula: "\\text{Energy (kcal)} = 4(P) + 4(C) + 9(F)",
    explanation: "Estimates the energy content of food from its macronutrient composition.",
    variables: [
      { symbol: "P", meaning: "protein (g)" },
      { symbol: "C", meaning: "carbohydrate (g)" },
      { symbol: "F", meaning: "fat (g)" },
    ],
    example: "Find energy for 20g protein, 30g carbs, 10g fat",
  },
  {
    id: 776,
    title: "Shelf Life Estimation (Q10 Model)",
    subject: "Food Science",
    category: "Food Preservation",
    level: "University",
    formula: "Q_{10} = \\left(\\frac{k_2}{k_1}\\right)^{\\frac{10}{T_2-T_1}}",
    explanation: "Estimates how spoilage rate changes with a 10°C temperature change.",
    variables: [
      { symbol: "k_1,k_2", meaning: "reaction rates at temperatures T1 and T2" },
    ],
    example: "Estimate shelf life change for a 10°C rise in storage temperature",
  },
  {
    id: 777,
    title: "Water Activity",
    subject: "Food Science",
    category: "Food Preservation",
    level: "University",
    formula: "a_w = \\frac{p}{p_0}",
    explanation: "Measures the availability of water in food for microbial growth.",
    variables: [
      { symbol: "p", meaning: "vapour pressure of water in food" },
      { symbol: "p_0", meaning: "vapour pressure of pure water" },
    ],
    example: "Find water activity given vapour pressure ratio",
  },
];
export default formulas;