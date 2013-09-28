// define cia_id -> page_id mappings for this book
// then include the new script
// NOTE THAT THE SCRIPT HAS AN ABSOLUTE URL -- 
// NEEDS TO BE SET TO COURSES.BFWPUB.COM

var cia_id_page_id_mappings = {
	'scientific_method': 'myers10e__1_2_1',  // Concepts in Action: Steps in the Scientific Method
	'correlation': 'myers10e__1_2_0',  // Concepts in Action: Positive and Negative Correlations
	'experiment_vocab': 'myers10e__1_2_2',  // Concepts in Action: The Language of Experiments
	'motor_neuron': 'myers10e__2_2_11',  // Concepts in Action: Structure of a Motor Neuron
	'action_potential': 'myers10e__2_2_12',  // Concepts in Action: Action Potentials
	'synapse': 'myers10e__2_2_10',  // Concepts in Action: Structure of a Synapse
	'neural_communication': 'myers10e__2_2_13',  // Concepts in Action: Neural Communication
	'lower_brain': 'myers10e__2_5_5',  // Concepts in Action: Lower Brain Structures
	'limbic_system': 'myers10e__2_5_6',  // Concepts in Action: The Limbic System
	'brain_areas': 'myers10e__2_5_7',  // Concepts in Action: Brain Areas within the Head
	'cerebral_cortex': 'myers10e__2_5_8',  // Concepts in Action: The Cerebral Cortex
	'visual_fields': 'myers10e__2_5_9',  // Concepts in Action: Visual Fields and Hemispheres
	'selective_attention': 'myers10e__3_1_0',  // Concepts in Action: Selective Attention
	'sleep_stages': 'myers10e__3_2_1',  // Concepts in Action: Stages of Sleep
	'dreaming': 'myers10e__3_2_0',  // Concepts in Action: Dreaming
	'psychoactive_drugs': 'myers10e__3_4_0',  // Concepts in Action: Psychoactive Drugs
	'prenatal': 'myers10e__5_2_0',  // Concepts in Action: Prenatal Development
	'motor_development': 'myers10e__5_3_0',  // Concepts in Action: Sequence of Motor Development
	'piaget_stages': 'myers10e__5_3_1',  // Concepts in Action: Piaget's Stages of Development
	'conservation': 'myers10e__5_3_2',  // Concepts in Action: Piaget and Conservation
	'erikson_stages': 'myers10e__5_4_0',  // Concepts in Action: Erikson's Stages of Development
	'aging_intelligence': 'myers10e__5_5_0',  // Concepts in Action: Does Aging Influence Intelligence?
	'light_waves': 'myers10e__6_2_0',  // Concepts in Action: Properties of Light Waves
	'eye_structure': 'myers10e__6_2_3',  // Concepts in Action: Structure of the Eye
	'cone_responses': 'myers10e__6_2_5',  // Concepts in Action: Wavelength and Cone Responses
	'visual_path': 'myers10e__6_2_4',  // Concepts in Action: The Visual Pathway
	'percept_grouping': 'myers10e__6_2_10',  // Concepts in Action: Perceptual Grouping
	'depth_cues': 'myers10e__6_2_1',  // Concepts in Action: Depth Cues
	'sound_waves': 'myers10e__6_3_2',  // Concepts in Action: Properties of Sound Waves
	'ear_structure': 'myers10e__6_3_3',  // Concepts in Action: Structure of the Ear
	'auditory_path': 'myers10e__6_3_1',  // Concepts in Action: The Auditory Pathway
	'locate_sounds': 'myers10e__6_3_0',  // Concepts in Action: Making and Locating Sounds
	'taste': 'myers10e__6_4_0',  // Concepts in Action: Taste Sensations
	'smell': 'myers10e__6_4_1',  // Concepts in Action: Sense of Smell
	'classical_sequence': 'myers10e__7_2_0',  // Concepts in Action: Sequence of Classical Conditioning
	'eyeblink': 'myers10e__7_2_1',  // Concepts in Action: Conditioning an Eye Blink
	'shaping': 'myers10e__7_3_0',  // Concepts in Action: Shaping a Response
	'reinforcers': 'myers10e__7_3_1',  // Concepts in Action: Reinforcers and Punishers
	'schedules': 'myers10e__7_3_2',  // Concepts in Action: Schedules of Reinforcement
	'daily_life': 'myers10e__7_3_3',  // Concepts in Action: Conditioning in Daily Life
	'bobo_doll': 'myers10e__7_5_0',  // Concepts in Action: Bandura's Bobo Doll Experiment
	'memory_systems': 'myers10e__8_1_0',  // Concepts in Action: Long-Term Memory Subsystems
	'stm_capacity': 'myers10e__8_3_0',  // Concepts in Action: Short-Term Memory Capacity
	'amnesia': 'myers10e__8_4_0',  // Concepts in Action: A Case of Amnesia
	'serial_position': 'myers10e__8_5_0',  // Concepts in Action: Serial Position Effect
	'memory_reliability': 'myers10e__8_7_0',  // Concepts in Action: How Reliable Is Your Memory?
	'confirmation_bias': 'myers10e__9_1_0',  // Concepts in Action: Confirmation Bias
	'avail_heuristic': 'myers10e__9_1_1',  // Concepts in Action: The Availability Heuristic
	'language_devel': 'myers10e__9_2_0',  // Concepts in Action: Language Development in Infancy
	'stroop_task': 'myers10e__9_3_0',  // Concepts in Action: Stroop Color-Word Task
	'multiple_intelligence': 'myers10e__10_1_0',  // Concepts in Action: Multiple Intelligence
	'wechsler_tasks': 'myers10e__10_2_0',  // Concepts in Action: Wechsler Intelligence Tasks
	'twins_adopt': 'myers10e__10_4_0',  // Concepts in Action: Studying Twins and Adopted Children
	'maslow_hierarchy': 'myers10e__11_1_0',  // Concepts in Action: Building Maslow's Hierarchy
	'hypothalamus_hunger': 'myers10e__11_2_0',  // Concepts in Action: The Hypothalamus and Hunger
	'emotion_theories': 'myers10e__12_1_0',  // Concepts in Action: Theories of Emotion
	'autonomic_nervsys': 'myers10e__12_2_0',  // Concepts in Action: The Autonomic Nervous System
	'facial_expressions': 'myers10e__12_3_0',  // Concepts in Action: Facial Expressions of Emotion
	'predict_happiness': 'myers10e__12_4_0',  // Concepts in Action: Predictors of Happiness
	'stress_response': 'myers10e__12_5_1',  // Concepts in Action: The Stress Response System
	'selye_gas': 'myers10e__12_5_2',  // Concepts in Action: General Adaptation Syndrome
	'stress_hurts': 'myers10e__12_5_0',  // Concepts in Action: Stress Hurts
	'freud_structure': 'myers10e__13_1_0',  // Concepts in Action: Freud's Personality Structure
	'freud_stages': 'myers10e__13_1_1',  // Concepts in Action: Freud's Psychosexual Stages
	'defense_mechanisms': 'myers10e__13_1_2',  // Concepts in Action: Defense Mechanisms
	'big_five_traits': 'myers10e__13_3_0',  // Concepts in Action: The Big Five Personality Traits
	'recip_determinism': 'myers10e__13_4_0',  // Concepts in Action: Reciprocal Determinism
	'attribution': 'myers10e__14_1_0',  // Concepts in Action: Making Attributions
	'cog_dissonance': 'myers10e__14_1_1',  // Concepts in Action: Cognitive Dissonance
	'group_size': 'myers10e__14_2_1',  // Concepts in Action: Conformity and Group Size
	'asch': 'myers10e__14_2_0',  // Concepts in Action: Conformity: The Asch Experiment
	'milgram': 'myers10e__14_2_2',  // Concepts in Action: Obedience: The Milgram Experiment
	'prejudice': 'myers10e__14_3_1',  // Concepts in Action: Sources of Prejudice
	'bystander_help': 'myers10e__14_3_0',  // Concepts in Action: When Will People Help Others?
	'explain_anxiety': 'myers10e__15_2_0',  // Concepts in Action: Explaining Anxiety Disorders
	'mood_types': 'myers10e__15_3_0',  // Concepts in Action: Types of Mood Disorders
	'explain_mood': 'myers10e__15_3_1',  // Concepts in Action: Explaining Mood Disorders
	'schizsymptoms': 'myers10e__15_4_0',  // Concepts in Action: Symptoms of Schizophrenia
	'explain_schiz': 'myers10e__15_5_0',  // Concepts in Action: Explaining Schizophrenia
	'risks_rates': 'myers10e__15_6_0',  // Concepts in Action: Risks and Rates of Disorders
	'psychoanalysis': 'myers10e__16_2_0',  // Concepts in Action: Methods of Psychoanalysis
	'desensitization': 'myers10e__16_2_1',  // Concepts in Action: Systematic Desensitization
	'therapies_therapists': 'myers10e__16_3_0',  // Concepts in Action: Types of Therapies and Therapists
	'drug_types': 'myers10e__16_4_1',  // Concepts in Action: Types of Therapeutic Drugs
	'prozac_effect': 'myers10e__16_4_0',  // Concepts in Action: How Does Prozac Work?
	'psych_perspectives': 'myers10e__19_2_0',  // Concepts in Action: Psychology's Current Perspectives
	'psych_subfields': 'myers10e__x_x_949'  // Concepts in Action: Psychology's Subfields
// PW: the ebook page appears to use "schizsymptoms" instead of "schiz_symptoms"
}

document.write('<script src="http://courses.bfwpub.com/arga/concepts_in_action/cia_in_ebook.js" type="text/javascript" language="Javascript"></scr' + 'ipt>');
