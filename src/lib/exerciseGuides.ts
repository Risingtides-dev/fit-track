// Exercise descriptions and form cues for each exercise
// These provide quick visual/text guidance on how to perform each movement

export interface ExerciseGuide {
  description: string;      // 1-sentence summary
  steps: string[];           // Key form cues (2-4 bullet points)
  primaryMuscles: string[];  // Muscles targeted
}

export const EXERCISE_GUIDES: Record<string, ExerciseGuide> = {
  // Chest — Push
  "bench-press": {
    description: "Lie flat on a bench, press a barbell from chest level to arm extension.",
    steps: ["Grip slightly wider than shoulder-width", "Lower bar to mid-chest", "Press up, keeping feet flat on floor", "Keep shoulder blades pinched together"],
    primaryMuscles: ["Chest", "Triceps", "Front Delts"],
  },
  "incline-bench": {
    description: "Bench press performed on a 30-45° incline to target the upper chest.",
    steps: ["Set bench to 30-45° angle", "Lower bar to upper chest", "Press up without flaring elbows excessively"],
    primaryMuscles: ["Upper Chest", "Triceps", "Front Delts"],
  },
  "decline-bench": {
    description: "Bench press on a decline angle to emphasize the lower chest.",
    steps: ["Set bench to 15-30° decline", "Hook feet under pads", "Lower bar to lower chest", "Press up in a controlled arc"],
    primaryMuscles: ["Lower Chest", "Triceps"],
  },
  "dumbbell-press": {
    description: "Press two dumbbells from chest level on a flat bench.",
    steps: ["Start with dumbbells at chest height", "Press up, bringing them slightly together at top", "Lower with control, elbows at ~45°"],
    primaryMuscles: ["Chest", "Triceps", "Front Delts"],
  },
  "incline-db-press": {
    description: "Dumbbell press on an incline bench for upper chest emphasis.",
    steps: ["Set bench to 30-45°", "Press dumbbells from upper chest to full extension", "Control the negative slowly"],
    primaryMuscles: ["Upper Chest", "Triceps", "Front Delts"],
  },
  "chest-fly": {
    description: "Open arms wide with dumbbells, then squeeze them together in an arc.",
    steps: ["Start with arms extended above chest", "Lower with slight bend in elbows", "Squeeze chest to bring dumbbells back together"],
    primaryMuscles: ["Chest", "Front Delts"],
  },
  "cable-crossover": {
    description: "Stand between cable pulleys and bring handles together in front of your chest.",
    steps: ["Set pulleys high for lower chest, low for upper", "Step forward slightly", "Bring handles together with a slight bend in elbows"],
    primaryMuscles: ["Chest", "Front Delts"],
  },
  "push-ups": {
    description: "Classic bodyweight exercise pressing your body up from the floor.",
    steps: ["Hands shoulder-width apart", "Body in straight line from head to heels", "Lower chest to floor", "Push back up fully"],
    primaryMuscles: ["Chest", "Triceps", "Core"],
  },
  "dips-chest": {
    description: "Lean forward on parallel bars to emphasize chest during dips.",
    steps: ["Lean torso forward 30-45°", "Lower until upper arms are parallel to floor", "Push up without locking elbows"],
    primaryMuscles: ["Lower Chest", "Triceps", "Front Delts"],
  },

  // Back — Pull
  "deadlift": {
    description: "Lift a barbell from the floor to hip level using your legs and back.",
    steps: ["Stand with feet hip-width, bar over mid-foot", "Hinge at hips, grip bar outside knees", "Drive through floor, keep bar close to body", "Lock out hips at top"],
    primaryMuscles: ["Back", "Glutes", "Hamstrings", "Core"],
  },
  "barbell-row": {
    description: "Hinge forward and row a barbell to your lower chest/upper abdomen.",
    steps: ["Hinge at hips ~45°, slight knee bend", "Pull bar to lower chest", "Squeeze shoulder blades at top", "Lower with control"],
    primaryMuscles: ["Upper Back", "Lats", "Biceps"],
  },
  "dumbbell-row": {
    description: "Row a dumbbell to your hip with one arm, supported by a bench.",
    steps: ["Place one knee and hand on bench", "Row dumbbell toward hip", "Keep elbow close to body", "Squeeze lat at top"],
    primaryMuscles: ["Lats", "Upper Back", "Biceps"],
  },
  "pull-ups": {
    description: "Hang from a bar with overhand grip, pull your chin above the bar.",
    steps: ["Grip bar slightly wider than shoulders", "Pull up, leading with chest", "Lower with full control", "Avoid swinging"],
    primaryMuscles: ["Lats", "Upper Back", "Biceps"],
  },
  "chin-ups": {
    description: "Pull-up variation with underhand (supinated) grip for more biceps.",
    steps: ["Grip bar shoulder-width, palms facing you", "Pull chin above bar", "Squeeze biceps at top", "Lower slowly"],
    primaryMuscles: ["Lats", "Biceps", "Upper Back"],
  },
  "lat-pulldown": {
    description: "Pull a cable bar down to your upper chest while seated.",
    steps: ["Grip wider than shoulders", "Pull bar to upper chest", "Lean back slightly", "Control the return slowly"],
    primaryMuscles: ["Lats", "Upper Back", "Biceps"],
  },
  "seated-row": {
    description: "Pull a cable handle to your abdomen while seated with feet braced.",
    steps: ["Sit tall, feet on platform", "Pull handle to lower abdomen", "Squeeze shoulder blades together", "Return with control"],
    primaryMuscles: ["Mid Back", "Lats", "Biceps"],
  },
  "t-bar-row": {
    description: "Row a T-bar or landmine setup to your chest.",
    steps: ["Straddle the bar, hinge at hips", "Row toward chest", "Keep core braced", "Lower with control"],
    primaryMuscles: ["Upper Back", "Lats", "Biceps"],
  },
  "face-pull": {
    description: "Pull a rope attachment to your face, externally rotating shoulders.",
    steps: ["Set cable at face height", "Pull rope toward face, spreading ends apart", "Externally rotate at the top", "Squeeze rear delts"],
    primaryMuscles: ["Rear Delts", "Upper Back", "Rotator Cuff"],
  },

  // Shoulders — Push
  "ohp": {
    description: "Press a barbell overhead from shoulder level to full arm extension.",
    steps: ["Start bar at front shoulders", "Press straight overhead", "Lock out arms, head through at top", "Brace core throughout"],
    primaryMuscles: ["Shoulders", "Triceps", "Upper Chest"],
  },
  "db-shoulder-press": {
    description: "Press dumbbells overhead while seated or standing.",
    steps: ["Start dumbbells at shoulder height", "Press overhead until arms are straight", "Lower to ear level with control"],
    primaryMuscles: ["Shoulders", "Triceps"],
  },
  "lateral-raise": {
    description: "Raise dumbbells out to the sides to target the medial deltoid.",
    steps: ["Arms at sides, slight elbow bend", "Raise to shoulder height", "Lead with elbows, not hands", "Lower slowly"],
    primaryMuscles: ["Side Delts"],
  },
  "front-raise": {
    description: "Raise dumbbells in front of you to shoulder height.",
    steps: ["Arms at sides, palms facing thighs", "Raise one or both arms to shoulder height", "Keep slight bend in elbow", "Lower with control"],
    primaryMuscles: ["Front Delts"],
  },
  "rear-delt-fly": {
    description: "Bend over and raise dumbbells to the sides to target rear delts.",
    steps: ["Hinge forward at hips", "Raise dumbbells out to sides", "Squeeze shoulder blades together", "Lower slowly"],
    primaryMuscles: ["Rear Delts", "Upper Back"],
  },
  "arnold-press": {
    description: "Rotating dumbbell press that transitions from palms-in to palms-out.",
    steps: ["Start with dumbbells in front, palms facing you", "Rotate and press overhead", "Reverse the rotation on the way down"],
    primaryMuscles: ["Shoulders", "Triceps"],
  },
  "shrugs": {
    description: "Elevate shoulders straight up to target the trapezius muscles.",
    steps: ["Hold weight at sides", "Shrug shoulders straight up toward ears", "Hold briefly at top", "Lower with control"],
    primaryMuscles: ["Traps"],
  },

  // Biceps — Pull
  "barbell-curl": {
    description: "Curl a barbell from hip level to shoulder level.",
    steps: ["Grip bar shoulder-width, arms extended", "Curl bar up, keeping elbows pinned at sides", "Squeeze at top", "Lower with control"],
    primaryMuscles: ["Biceps"],
  },
  "dumbbell-curl": {
    description: "Curl dumbbells alternating or together from hip to shoulder.",
    steps: ["Start with arms at sides", "Curl up, supinating wrist as you go", "Keep elbows stationary", "Lower slowly"],
    primaryMuscles: ["Biceps"],
  },
  "hammer-curl": {
    description: "Curl with neutral (thumbs-up) grip to target brachialis and forearms.",
    steps: ["Hold dumbbells with neutral grip", "Curl up keeping palms facing each other", "Keep elbows at your sides"],
    primaryMuscles: ["Biceps", "Brachialis", "Forearms"],
  },
  "preacher-curl": {
    description: "Curl with upper arms braced against a preacher bench for strict isolation.",
    steps: ["Rest upper arms on pad", "Curl weight up without lifting elbows", "Squeeze at top", "Lower fully with control"],
    primaryMuscles: ["Biceps"],
  },
  "cable-curl": {
    description: "Curl using a cable machine for constant tension throughout the movement.",
    steps: ["Stand facing cable, grip bar or handle", "Curl up keeping elbows pinned", "Squeeze at contraction", "Lower with control"],
    primaryMuscles: ["Biceps"],
  },
  "concentration-curl": {
    description: "Seated curl with elbow braced against inner thigh for maximum isolation.",
    steps: ["Sit, brace elbow on inner thigh", "Curl dumbbell toward shoulder", "Squeeze at peak contraction", "Lower slowly"],
    primaryMuscles: ["Biceps"],
  },

  // Triceps — Push
  "tricep-pushdown": {
    description: "Push a cable attachment down from chest to hip level.",
    steps: ["Stand facing cable with rope or bar", "Push down, extending arms fully", "Keep elbows pinned at sides", "Return slowly"],
    primaryMuscles: ["Triceps"],
  },
  "overhead-extension": {
    description: "Extend a weight overhead by straightening the elbows above your head.",
    steps: ["Hold dumbbell or cable behind head", "Extend arms overhead", "Keep upper arms close to ears", "Lower behind head with control"],
    primaryMuscles: ["Triceps (Long Head)"],
  },
  "skull-crushers": {
    description: "Lying on a bench, lower a barbell to your forehead then extend back up.",
    steps: ["Lie flat, hold bar with narrow grip", "Lower bar toward forehead", "Extend arms back up", "Keep upper arms vertical"],
    primaryMuscles: ["Triceps"],
  },
  "close-grip-bench": {
    description: "Bench press with a narrower grip to emphasize triceps.",
    steps: ["Grip bar shoulder-width or slightly narrower", "Lower to lower chest", "Press up, focusing on tricep contraction", "Keep elbows tucked"],
    primaryMuscles: ["Triceps", "Chest"],
  },
  "dips-triceps": {
    description: "Dips with an upright torso to target the triceps.",
    steps: ["Keep torso upright (not leaning forward)", "Lower until elbows are ~90°", "Push up to full extension"],
    primaryMuscles: ["Triceps", "Chest", "Front Delts"],
  },
  "kickbacks": {
    description: "Extend a dumbbell backward while hinged forward to isolate the triceps.",
    steps: ["Hinge forward, upper arm parallel to floor", "Extend forearm back until arm is straight", "Squeeze tricep at top", "Lower with control"],
    primaryMuscles: ["Triceps"],
  },

  // Legs
  "squat": {
    description: "Place a barbell on your back and squat down until thighs are parallel.",
    steps: ["Bar on upper back, feet shoulder-width", "Break at hips and knees simultaneously", "Descend until thighs are at least parallel", "Drive up through heels"],
    primaryMuscles: ["Quads", "Glutes", "Hamstrings", "Core"],
  },
  "front-squat": {
    description: "Squat with a barbell held in front, racked on your shoulders.",
    steps: ["Bar in front rack position on delts", "Keep elbows high", "Squat deep, keeping torso upright", "Drive up through mid-foot"],
    primaryMuscles: ["Quads", "Core", "Upper Back"],
  },
  "leg-press": {
    description: "Push a weighted platform away using your legs while seated.",
    steps: ["Feet shoulder-width on platform", "Lower platform until knees are ~90°", "Push back up without locking knees", "Keep lower back flat against pad"],
    primaryMuscles: ["Quads", "Glutes", "Hamstrings"],
  },
  "leg-extension": {
    description: "Extend your lower legs against a padded lever to isolate the quads.",
    steps: ["Sit with back flat against pad", "Extend legs until straight", "Squeeze quads at top", "Lower with control"],
    primaryMuscles: ["Quads"],
  },
  "leg-curl": {
    description: "Curl your lower legs against resistance to target the hamstrings.",
    steps: ["Lie face down or sit in machine", "Curl heels toward glutes", "Squeeze hamstrings at peak", "Lower slowly"],
    primaryMuscles: ["Hamstrings"],
  },
  "romanian-deadlift": {
    description: "Hinge at the hips with slight knee bend, lowering a barbell along your legs.",
    steps: ["Hold bar at hips, slight knee bend", "Hinge forward, pushing hips back", "Lower bar along legs until hamstring stretch", "Drive hips forward to stand"],
    primaryMuscles: ["Hamstrings", "Glutes", "Lower Back"],
  },
  "lunges": {
    description: "Step forward and lower your back knee toward the floor.",
    steps: ["Take a large step forward", "Lower until both knees are ~90°", "Push back to starting position", "Keep torso upright"],
    primaryMuscles: ["Quads", "Glutes", "Hamstrings"],
  },
  "bulgarian-split-squat": {
    description: "Single-leg squat with rear foot elevated on a bench.",
    steps: ["Rear foot on bench behind you", "Lower until front thigh is parallel", "Drive up through front heel", "Keep torso upright"],
    primaryMuscles: ["Quads", "Glutes"],
  },
  "calf-raise": {
    description: "Rise up on your toes to target the calf muscles.",
    steps: ["Stand on edge of step or platform", "Rise up on toes as high as possible", "Hold briefly at top", "Lower heels below platform for full stretch"],
    primaryMuscles: ["Calves"],
  },
  "hack-squat": {
    description: "Machine squat with back against an angled pad.",
    steps: ["Shoulders under pads, feet shoulder-width", "Lower until thighs are parallel", "Push up through heels", "Don't lock knees at top"],
    primaryMuscles: ["Quads", "Glutes"],
  },

  // Glutes
  "hip-thrust": {
    description: "Drive a barbell upward with your hips while upper back is on a bench.",
    steps: ["Upper back on bench, bar over hips", "Drive hips up until body is straight", "Squeeze glutes hard at top", "Lower with control"],
    primaryMuscles: ["Glutes", "Hamstrings"],
  },
  "glute-bridge": {
    description: "Lie on the floor and drive hips upward squeezing glutes.",
    steps: ["Lie face up, feet flat on floor near glutes", "Drive hips up", "Squeeze glutes at top", "Lower slowly"],
    primaryMuscles: ["Glutes", "Hamstrings"],
  },
  "cable-kickback": {
    description: "Kick one leg back against cable resistance to isolate glutes.",
    steps: ["Attach ankle cuff to low cable", "Kick leg straight back", "Squeeze glute at full extension", "Return with control"],
    primaryMuscles: ["Glutes"],
  },

  // Core
  "plank": {
    description: "Hold a push-up position on forearms to build core stability.",
    steps: ["Forearms on floor, elbows under shoulders", "Body in straight line", "Brace core, squeeze glutes", "Hold for time"],
    primaryMuscles: ["Core", "Shoulders"],
  },
  "crunches": {
    description: "Lie on your back and curl your shoulders up off the floor.",
    steps: ["Lie face up, knees bent, hands behind head", "Curl shoulders off floor", "Don't pull on neck", "Lower with control"],
    primaryMuscles: ["Abs"],
  },
  "hanging-leg-raise": {
    description: "Hang from a bar and raise your legs to target lower abs.",
    steps: ["Hang with straight arms", "Raise legs to parallel or higher", "Avoid swinging", "Lower slowly"],
    primaryMuscles: ["Lower Abs", "Hip Flexors"],
  },
  "cable-crunch": {
    description: "Kneel facing a cable and crunch down against resistance.",
    steps: ["Kneel below cable with rope behind head", "Crunch down, curling torso", "Focus on contracting abs", "Return with control"],
    primaryMuscles: ["Abs"],
  },
  "russian-twist": {
    description: "Sit with feet elevated and rotate your torso side to side.",
    steps: ["Sit with torso at 45°, feet off floor", "Hold weight at chest", "Rotate side to side", "Keep core braced throughout"],
    primaryMuscles: ["Obliques", "Abs"],
  },
  "ab-wheel": {
    description: "Roll an ab wheel forward from your knees, extending your body.",
    steps: ["Kneel with wheel in front", "Roll forward as far as you can control", "Keep core tight, don't let hips sag", "Roll back to start"],
    primaryMuscles: ["Abs", "Core", "Lats"],
  },

  // Cardio
  "running": {
    description: "Steady-state or interval running outdoors or on a track.",
    steps: ["Warm up with 5 min easy jog", "Maintain steady pace or do intervals", "Land mid-foot, keep cadence up", "Cool down with walking"],
    primaryMuscles: ["Legs", "Cardiovascular"],
  },
  "treadmill": {
    description: "Running or walking on a motorized treadmill.",
    steps: ["Set speed and incline", "Start with warm-up pace", "Maintain form — don't hold rails", "Gradually increase intensity"],
    primaryMuscles: ["Legs", "Cardiovascular"],
  },
  "cycling": {
    description: "Ride a bicycle outdoors for cardio and leg endurance.",
    steps: ["Adjust seat height — slight knee bend at bottom", "Pedal at steady cadence", "Use gears to manage effort", "Keep upper body relaxed"],
    primaryMuscles: ["Quads", "Cardiovascular"],
  },
  "stationary-bike": {
    description: "Cycle on a stationary bike for indoor cardio training.",
    steps: ["Adjust seat and handlebar height", "Pedal at consistent cadence", "Adjust resistance for intervals", "Keep core engaged"],
    primaryMuscles: ["Quads", "Cardiovascular"],
  },
  "elliptical": {
    description: "Low-impact full-body cardio on an elliptical machine.",
    steps: ["Stand tall, grip handles lightly", "Push and pull with arms and legs", "Keep movements smooth", "Adjust resistance as needed"],
    primaryMuscles: ["Full Body", "Cardiovascular"],
  },
  "rowing-machine": {
    description: "Full-body cardio using a rowing ergometer.",
    steps: ["Drive with legs first, then lean back, then pull arms", "Reverse the sequence on the return", "Keep core braced", "Maintain steady stroke rate"],
    primaryMuscles: ["Back", "Legs", "Cardiovascular"],
  },
  "stairmaster": {
    description: "Climb stairs continuously on a stair-stepping machine.",
    steps: ["Stand upright, light grip on rails", "Step at a challenging but sustainable pace", "Don't lean on the machine", "Keep steps full-range"],
    primaryMuscles: ["Quads", "Glutes", "Cardiovascular"],
  },
  "jump-rope": {
    description: "Skip rope for high-intensity cardiovascular conditioning.",
    steps: ["Hold handles at hip height", "Jump with small, quick hops", "Turn rope with wrists, not arms", "Stay on balls of feet"],
    primaryMuscles: ["Calves", "Shoulders", "Cardiovascular"],
  },
  "swimming": {
    description: "Swim laps in a pool for full-body low-impact cardio.",
    steps: ["Choose a stroke (freestyle, backstroke, etc.)", "Focus on breathing rhythm", "Keep streamlined body position", "Alternate strokes for variety"],
    primaryMuscles: ["Full Body", "Cardiovascular"],
  },
  "walking": {
    description: "Brisk walking for low-intensity cardio and recovery.",
    steps: ["Maintain brisk pace", "Swing arms naturally", "Keep good posture", "Aim for 30+ minutes"],
    primaryMuscles: ["Legs", "Cardiovascular"],
  },
};
