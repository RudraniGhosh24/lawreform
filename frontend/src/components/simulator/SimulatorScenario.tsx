'use client'
import { useState } from 'react'
import { RotateCcw, Loader2 } from 'lucide-react'

/*
  Branching scenario trees.
  Each choice has an optional `next` field pointing to the next node id.
  If `next` is null/undefined, the scenario ends after that choice.
  The `correct` flag marks the ideal choice for scoring.
*/

interface Choice {
  id: string
  text: string
  next?: string | null
  correct?: boolean
}

interface ScenarioNode {
  id: string
  situation: string
  choices: Choice[]
}

interface Scenario {
  title: string
  startNode: string
  nodes: Record<string, ScenarioNode>
}

const scenarios: Record<string, Scenario> = {
  road_accident: {
    title: 'Road Accident',
    startNode: 'n1',
    nodes: {
      n1: {
        id: 'n1',
        situation: 'You are driving and witness a serious road accident. A car has crashed and someone appears injured. What do you do first?',
        choices: [
          { id: 'a', text: 'Stop your vehicle safely and assess the situation', next: 'n2_stopped', correct: true },
          { id: 'b', text: 'Drive past — it\'s not your problem', next: 'n2_drove_past' },
          { id: 'c', text: 'Slow down, take a video, then drive on', next: 'n2_filmed' },
          { id: 'd', text: 'Call someone else to handle it', next: 'n2_delegated' },
        ],
      },
      n2_stopped: {
        id: 'n2_stopped',
        situation: 'You\'ve stopped safely. The injured person is conscious but bleeding. There are no other bystanders. What do you do?',
        choices: [
          { id: 'a', text: 'Call emergency services (ambulance + police) immediately', next: 'n3_called' },
          { id: 'b', text: 'Try to move the person to a safer spot first', next: 'n3_moved' },
          { id: 'c', text: 'Wait for someone more qualified to arrive', next: 'n3_waited' },
          { id: 'd', text: 'Apply pressure to the wound and call for help simultaneously', next: 'n3_called', correct: true },
        ],
      },
      n2_drove_past: {
        id: 'n2_drove_past',
        situation: 'You drove past. A few minutes later, you hear on the radio that the victim died because no one stopped to help. You feel guilt. What do you do now?',
        choices: [
          { id: 'a', text: 'Turn around and go back to the scene', next: 'n3_returned', correct: true },
          { id: 'b', text: 'Call the police anonymously to report the accident', next: 'n3_anon_report' },
          { id: 'c', text: 'Do nothing — it\'s too late now', next: null },
          { id: 'd', text: 'Post about it on social media', next: null },
        ],
      },
      n2_filmed: {
        id: 'n2_filmed',
        situation: 'You filmed the scene and drove on. Your video goes viral but the victim\'s family sees it and is outraged that you filmed instead of helping. What do you do?',
        choices: [
          { id: 'a', text: 'Delete the video and contact the family to apologise', next: null, correct: true },
          { id: 'b', text: 'Keep the video up — it raises awareness', next: null },
          { id: 'c', text: 'Report the accident to police now with the video as evidence', next: 'n3_anon_report' },
          { id: 'd', text: 'Ignore the backlash', next: null },
        ],
      },
      n2_delegated: {
        id: 'n2_delegated',
        situation: 'You called a friend to handle it, but they didn\'t go. The victim is still lying on the road. What do you do?',
        choices: [
          { id: 'a', text: 'Go back to the scene yourself immediately', next: 'n3_returned', correct: true },
          { id: 'b', text: 'Call emergency services now', next: 'n3_called' },
          { id: 'c', text: 'Assume someone else will help', next: null },
          { id: 'd', text: 'Call another friend', next: null },
        ],
      },
      n3_called: {
        id: 'n3_called',
        situation: 'Emergency services are on the way. The driver of the crashed car is trying to flee the scene. What do you do?',
        choices: [
          { id: 'a', text: 'Note the vehicle number, description, and direction — report to police', next: 'n4_witness', correct: true },
          { id: 'b', text: 'Physically stop them from leaving', next: 'n4_witness' },
          { id: 'c', text: 'Let them go — not your concern', next: 'n4_witness' },
          { id: 'd', text: 'Follow them in your car', next: 'n4_witness' },
        ],
      },
      n3_moved: {
        id: 'n3_moved',
        situation: 'You moved the person, but they screamed in pain — they may have a spinal injury. What do you do now?',
        choices: [
          { id: 'a', text: 'Stop moving them immediately and call emergency services', next: 'n4_witness', correct: true },
          { id: 'b', text: 'Continue moving them to the side of the road', next: 'n4_witness' },
          { id: 'c', text: 'Try to stabilise their neck and back', next: 'n4_witness' },
          { id: 'd', text: 'Leave them where they are and drive away', next: null },
        ],
      },
      n3_waited: {
        id: 'n3_waited',
        situation: '10 minutes have passed. No one else has stopped. The victim is losing consciousness. What do you do?',
        choices: [
          { id: 'a', text: 'Call emergency services immediately — you should have done this first', next: 'n4_witness', correct: true },
          { id: 'b', text: 'Try to wake them up by shaking them', next: 'n4_witness' },
          { id: 'c', text: 'Drive to the nearest hospital for help', next: null },
          { id: 'd', text: 'Continue waiting', next: null },
        ],
      },
      n3_returned: {
        id: 'n3_returned',
        situation: 'You\'ve returned to the scene. The victim is still there but weaker. Emergency services haven\'t been called. What do you do?',
        choices: [
          { id: 'a', text: 'Call emergency services immediately and provide first aid if possible', next: 'n4_witness', correct: true },
          { id: 'b', text: 'Try to drive them to the hospital yourself', next: null },
          { id: 'c', text: 'Look for other witnesses first', next: 'n4_witness' },
          { id: 'd', text: 'Take photos for evidence', next: 'n4_witness' },
        ],
      },
      n3_anon_report: {
        id: 'n3_anon_report',
        situation: 'You\'ve reported the accident. Police ask if you can come to the station to give a statement. What do you do?',
        choices: [
          { id: 'a', text: 'Go to the station and give a full, honest statement', next: null, correct: true },
          { id: 'b', text: 'Refuse — you don\'t want to get involved', next: null },
          { id: 'c', text: 'Give a statement over the phone instead', next: null },
          { id: 'd', text: 'Ignore the request', next: null },
        ],
      },
      n4_witness: {
        id: 'n4_witness',
        situation: 'Police arrive and ask for your statement. You saw the accident clearly. What do you do?',
        choices: [
          { id: 'a', text: 'Give a full, honest statement of what you witnessed', next: null, correct: true },
          { id: 'b', text: 'Say you didn\'t see anything to avoid involvement', next: null },
          { id: 'c', text: 'Give a partial statement and leave quickly', next: null },
          { id: 'd', text: 'Refuse to give a statement without a lawyer', next: null },
        ],
      },
    },
  },
  drowning: {
    title: 'Drowning / Medical Emergency',
    startNode: 'n1',
    nodes: {
      n1: {
        id: 'n1',
        situation: 'You see someone struggling in water — a pool or open water. They appear to be drowning. What is your first action?',
        choices: [
          { id: 'a', text: 'Shout for help and call emergency services immediately', next: 'n2_called', correct: true },
          { id: 'b', text: 'Jump in immediately to save them', next: 'n2_jumped_in' },
          { id: 'c', text: 'Look for a rope, ring buoy, or flotation device first', next: 'n2_found_device' },
          { id: 'd', text: 'Wait to see if they recover on their own', next: 'n2_waited' },
        ],
      },
      n2_called: {
        id: 'n2_called',
        situation: 'You\'ve called for help. There\'s a life ring nearby. The person is 10 metres away. What do you do?',
        choices: [
          { id: 'a', text: 'Throw the life ring toward them while shouting instructions', next: 'n3_rescued', correct: true },
          { id: 'b', text: 'Swim out to them directly', next: 'n3_rescued' },
          { id: 'c', text: 'Wait for lifeguards', next: 'n3_waited_rescue' },
          { id: 'd', text: 'Try to find a long stick or rope to extend', next: 'n3_rescued' },
        ],
      },
      n2_jumped_in: {
        id: 'n2_jumped_in',
        situation: 'You jumped in. The drowning person is panicking and grabbing onto you, pulling you under. You\'re now in danger too. What do you do?',
        choices: [
          { id: 'a', text: 'Push away, swim back, and shout for help — you need a flotation device', next: 'n3_rescued', correct: true },
          { id: 'b', text: 'Keep trying to hold them above water', next: 'n3_both_struggling' },
          { id: 'c', text: 'Dive under to escape their grip, then approach from behind', next: 'n3_rescued' },
          { id: 'd', text: 'Try to calm them down verbally while treading water', next: 'n3_both_struggling' },
        ],
      },
      n2_found_device: {
        id: 'n2_found_device',
        situation: 'You found a life ring. The person is 10 metres away and going under. What do you do?',
        choices: [
          { id: 'a', text: 'Throw the life ring toward them and call emergency services', next: 'n3_rescued', correct: true },
          { id: 'b', text: 'Swim out with the life ring', next: 'n3_rescued' },
          { id: 'c', text: 'Throw the ring and jump in after it', next: 'n3_rescued' },
          { id: 'd', text: 'Wait for someone stronger to throw it', next: 'n3_waited_rescue' },
        ],
      },
      n2_waited: {
        id: 'n2_waited',
        situation: 'You waited. The person has gone under and is no longer visible. Precious seconds have been lost. What do you do now?',
        choices: [
          { id: 'a', text: 'Call emergency services immediately and alert everyone nearby', next: 'n3_waited_rescue', correct: true },
          { id: 'b', text: 'Jump in to search for them', next: 'n3_both_struggling' },
          { id: 'c', text: 'Run to find a lifeguard', next: 'n3_waited_rescue' },
          { id: 'd', text: 'It\'s too late — leave the scene', next: null },
        ],
      },
      n3_rescued: {
        id: 'n3_rescued',
        situation: 'The person is pulled out of the water. They are unconscious and not breathing. What do you do?',
        choices: [
          { id: 'a', text: 'Begin CPR immediately — 30 compressions, 2 rescue breaths', next: null, correct: true },
          { id: 'b', text: 'Turn them on their side and wait for ambulance', next: null },
          { id: 'c', text: 'Shake them vigorously to wake them', next: null },
          { id: 'd', text: 'Do nothing — you\'re not trained', next: null },
        ],
      },
      n3_both_struggling: {
        id: 'n3_both_struggling',
        situation: 'Both of you are struggling in the water. Someone on shore has noticed. What should happen?',
        choices: [
          { id: 'a', text: 'The person on shore should throw a flotation device and call emergency services — NOT jump in', next: null, correct: true },
          { id: 'b', text: 'The person on shore should jump in to help both of you', next: null },
          { id: 'c', text: 'You should let go of the victim to save yourself', next: null },
          { id: 'd', text: 'Keep struggling — help will come eventually', next: null },
        ],
      },
      n3_waited_rescue: {
        id: 'n3_waited_rescue',
        situation: 'Emergency services arrive. They pull the person out — they are unconscious. A paramedic asks if anyone knows CPR. What do you do?',
        choices: [
          { id: 'a', text: 'If you know CPR, offer to help until paramedics take over', next: null, correct: true },
          { id: 'b', text: 'Step back — let the professionals handle it', next: null },
          { id: 'c', text: 'Try to help even though you don\'t know CPR', next: null },
          { id: 'd', text: 'Leave — emergency services are here now', next: null },
        ],
      },
    },
  },
  fraud: {
    title: 'Fraud / Scam',
    startNode: 'n1',
    nodes: {
      n1: {
        id: 'n1',
        situation: 'You receive a call from someone claiming to be your bank. They say your account is compromised and ask for your OTP to "secure" it. What do you do?',
        choices: [
          { id: 'a', text: 'Hang up immediately and call your bank\'s official number', next: 'n2_hung_up', correct: true },
          { id: 'b', text: 'Give the OTP — they sound official', next: 'n2_gave_otp' },
          { id: 'c', text: 'Ask them to verify themselves first, then decide', next: 'n2_questioned' },
          { id: 'd', text: 'Give partial information to test them', next: 'n2_gave_partial' },
        ],
      },
      n2_hung_up: {
        id: 'n2_hung_up',
        situation: 'You hung up and called your bank. They confirm it was a scam attempt. Your account is safe. What do you do next?',
        choices: [
          { id: 'a', text: 'Report the scam number to your bank and cybercrime authorities', next: 'n3_reported', correct: true },
          { id: 'b', text: 'Do nothing — your account is safe', next: null },
          { id: 'c', text: 'Warn friends and family about the scam', next: 'n3_reported' },
          { id: 'd', text: 'Block the number and move on', next: null },
        ],
      },
      n2_gave_otp: {
        id: 'n2_gave_otp',
        situation: 'You gave the OTP. Within minutes, money has been transferred out of your account. What is your first step?',
        choices: [
          { id: 'a', text: 'Call your bank immediately to freeze the account and reverse the transaction', next: 'n3_bank_frozen', correct: true },
          { id: 'b', text: 'Wait to see if the money comes back', next: 'n3_too_late' },
          { id: 'c', text: 'Post about it on social media', next: 'n3_too_late' },
          { id: 'd', text: 'Contact the scammer to ask for the money back', next: 'n3_too_late' },
        ],
      },
      n2_questioned: {
        id: 'n2_questioned',
        situation: 'You asked them to verify. They gave you your name and last 4 digits of your card (publicly available info). They\'re pressing you for the OTP urgently. What do you do?',
        choices: [
          { id: 'a', text: 'Hang up — real banks never ask for OTPs over the phone', next: 'n3_reported', correct: true },
          { id: 'b', text: 'They verified themselves — give the OTP', next: 'n2_gave_otp' },
          { id: 'c', text: 'Ask for their employee ID and call back', next: 'n3_reported' },
          { id: 'd', text: 'Give a wrong OTP to test them', next: 'n3_reported' },
        ],
      },
      n2_gave_partial: {
        id: 'n2_gave_partial',
        situation: 'You gave partial information. The scammer now has enough to attempt a SIM swap or phishing attack. What do you do?',
        choices: [
          { id: 'a', text: 'Call your bank and mobile provider immediately to secure your accounts', next: 'n3_reported', correct: true },
          { id: 'b', text: 'Wait to see if anything happens', next: 'n3_too_late' },
          { id: 'c', text: 'Change your passwords online', next: 'n3_reported' },
          { id: 'd', text: 'Do nothing — you only gave partial info', next: 'n3_too_late' },
        ],
      },
      n3_bank_frozen: {
        id: 'n3_bank_frozen',
        situation: 'Your bank has frozen the account. What legal steps should you take next?',
        choices: [
          { id: 'a', text: 'File a police complaint (FIR/cybercrime report) with all evidence', next: null, correct: true },
          { id: 'b', text: 'Do nothing — the bank will handle it', next: null },
          { id: 'c', text: 'Hire a private investigator', next: null },
          { id: 'd', text: 'Only report if the amount is large', next: null },
        ],
      },
      n3_reported: {
        id: 'n3_reported',
        situation: 'You\'ve secured your accounts. Should you take any further action?',
        choices: [
          { id: 'a', text: 'File a report with cybercrime authorities and warn others', next: null, correct: true },
          { id: 'b', text: 'No — everything is secure now', next: null },
          { id: 'c', text: 'Change all passwords and enable 2FA on everything', next: null },
          { id: 'd', text: 'Monitor your accounts for a few weeks', next: null },
        ],
      },
      n3_too_late: {
        id: 'n3_too_late',
        situation: 'Time has passed. Your bank says the money has been moved to another account and recovery is difficult. What should you do?',
        choices: [
          { id: 'a', text: 'File a police complaint immediately — even late reports help', next: null, correct: true },
          { id: 'b', text: 'Accept the loss', next: null },
          { id: 'c', text: 'Try to track the scammer yourself online', next: null },
          { id: 'd', text: 'Blame the bank and threaten legal action', next: null },
        ],
      },
    },
  },
  harassment: {
    title: 'Harassment',
    startNode: 'n1',
    nodes: {
      n1: {
        id: 'n1',
        situation: 'You witness a person being verbally harassed aggressively in a public place. The harasser is physically intimidating. What do you do?',
        choices: [
          { id: 'a', text: 'Directly intervene and confront the harasser', next: 'n2_confronted' },
          { id: 'b', text: 'Call police and stay nearby as a witness', next: 'n2_called_police' },
          { id: 'c', text: 'Approach the victim calmly, offer support, and create distance from harasser', next: 'n2_supported', correct: true },
          { id: 'd', text: 'Walk away — it\'s a private matter', next: 'n2_walked_away' },
        ],
      },
      n2_confronted: {
        id: 'n2_confronted',
        situation: 'The harasser turns aggressive toward you. The situation is escalating. What do you do?',
        choices: [
          { id: 'a', text: 'Back away, call police, and keep a safe distance', next: 'n3_witness', correct: true },
          { id: 'b', text: 'Stand your ground and argue back', next: 'n3_witness' },
          { id: 'c', text: 'Get physical to protect the victim', next: 'n3_witness' },
          { id: 'd', text: 'Run away', next: null },
        ],
      },
      n2_called_police: {
        id: 'n2_called_police',
        situation: 'Police are on the way. The harasser has left. The victim is distressed and alone. What do you do?',
        choices: [
          { id: 'a', text: 'Approach the victim, ask if they\'re okay, and offer to stay until police arrive', next: 'n3_witness', correct: true },
          { id: 'b', text: 'Leave — police will handle it', next: null },
          { id: 'c', text: 'Follow the harasser to track where they go', next: 'n3_witness' },
          { id: 'd', text: 'Take photos of the victim for evidence', next: 'n3_witness' },
        ],
      },
      n2_supported: {
        id: 'n2_supported',
        situation: 'You approached the victim calmly. The harasser has moved away. The victim is shaken but safe. What do you do?',
        choices: [
          { id: 'a', text: 'Ask if they\'re okay, offer to stay with them, and help them report if they want', next: 'n3_witness', correct: true },
          { id: 'b', text: 'Leave now that the danger is over', next: null },
          { id: 'c', text: 'Take photos of the harasser for evidence', next: 'n3_witness' },
          { id: 'd', text: 'Tell them to report it themselves later', next: null },
        ],
      },
      n2_walked_away: {
        id: 'n2_walked_away',
        situation: 'You walked away. Later you learn the harassment escalated into a physical assault. The victim was injured. How do you feel about your decision?',
        choices: [
          { id: 'a', text: 'Contact police now and offer to be a witness to what you saw earlier', next: null, correct: true },
          { id: 'b', text: 'Feel guilty but do nothing', next: null },
          { id: 'c', text: 'Post about it on social media to raise awareness', next: null },
          { id: 'd', text: 'It wasn\'t your responsibility', next: null },
        ],
      },
      n3_witness: {
        id: 'n3_witness',
        situation: 'The victim wants to file a complaint. You witnessed everything. What is your role?',
        choices: [
          { id: 'a', text: 'Offer to be a witness and provide your contact details to police', next: null, correct: true },
          { id: 'b', text: 'Decline — you don\'t want to get involved legally', next: null },
          { id: 'c', text: 'Write down what you saw and give it to the victim', next: null },
          { id: 'd', text: 'Only help if asked by police officially', next: null },
        ],
      },
    },
  },
  sexual_assault: {
    title: 'Sexual Assault / Rape',
    startNode: 'n1',
    nodes: {
      n1: {
        id: 'n1',
        situation: 'A friend discloses to you that they were sexually assaulted recently. They are distressed and unsure what to do. What is your first response?',
        choices: [
          { id: 'a', text: 'Listen without judgment, believe them, and ask what support they need', next: 'n2_listened', correct: true },
          { id: 'b', text: 'Immediately tell them to go to the police', next: 'n2_pushed_police' },
          { id: 'c', text: 'Ask them what they were wearing or doing', next: 'n2_blamed' },
          { id: 'd', text: 'Tell other friends to help handle it', next: 'n2_told_others' },
        ],
      },
      n2_listened: {
        id: 'n2_listened',
        situation: 'They feel heard and safe. They want to report it but are scared. What do you advise about preserving evidence?',
        choices: [
          { id: 'a', text: 'Do not shower, change clothes, or clean up — preserve all physical evidence', next: 'n3_report', correct: true },
          { id: 'b', text: 'Clean up first for dignity, then report', next: 'n3_report' },
          { id: 'c', text: 'Take photos of injuries yourself', next: 'n3_report' },
          { id: 'd', text: 'Evidence doesn\'t matter if they know the person', next: 'n3_report' },
        ],
      },
      n2_pushed_police: {
        id: 'n2_pushed_police',
        situation: 'They feel pressured and shut down. They say they\'re not ready. What do you do?',
        choices: [
          { id: 'a', text: 'Apologise, step back, and let them lead — offer support without pressure', next: 'n3_report', correct: true },
          { id: 'b', text: 'Insist that reporting is the only right thing to do', next: 'n3_report' },
          { id: 'c', text: 'Report it yourself without their consent', next: null },
          { id: 'd', text: 'Drop the subject entirely', next: null },
        ],
      },
      n2_blamed: {
        id: 'n2_blamed',
        situation: 'Your friend is hurt by your question and withdraws. They feel blamed. What do you do?',
        choices: [
          { id: 'a', text: 'Apologise sincerely — acknowledge that nothing they did caused this', next: 'n3_report', correct: true },
          { id: 'b', text: 'Explain you were just trying to understand the situation', next: 'n3_report' },
          { id: 'c', text: 'Give them space and check in later', next: null },
          { id: 'd', text: 'Move on — they\'re overreacting', next: null },
        ],
      },
      n2_told_others: {
        id: 'n2_told_others',
        situation: 'Your friend is furious that you told others without their consent. Their privacy has been violated. What do you do?',
        choices: [
          { id: 'a', text: 'Apologise deeply — you should never have shared without consent', next: 'n3_report', correct: true },
          { id: 'b', text: 'Explain you were trying to get them help', next: 'n3_report' },
          { id: 'c', text: 'Tell them it\'s better that people know', next: null },
          { id: 'd', text: 'Blame the friends you told for spreading it', next: null },
        ],
      },
      n3_report: {
        id: 'n3_report',
        situation: 'They decide to report. What is the correct process?',
        choices: [
          { id: 'a', text: 'Go to the nearest hospital first for medical examination, then file FIR/police report', next: null, correct: true },
          { id: 'b', text: 'File a social media post to name the person first', next: null },
          { id: 'c', text: 'Contact a lawyer before doing anything', next: null },
          { id: 'd', text: 'Report only if there are witnesses', next: null },
        ],
      },
    },
  },
  domestic_violence: {
    title: 'Domestic Violence',
    startNode: 'n1',
    nodes: {
      n1: {
        id: 'n1',
        situation: 'You suspect your neighbour is experiencing domestic violence — you hear shouting and sounds of physical altercation regularly. What do you do?',
        choices: [
          { id: 'a', text: 'Call police immediately if you believe someone is in immediate danger', next: 'n2_called_police', correct: true },
          { id: 'b', text: 'Knock on the door to check', next: 'n2_knocked' },
          { id: 'c', text: 'Mind your own business', next: 'n2_ignored' },
          { id: 'd', text: 'Talk to other neighbours first before deciding', next: 'n2_consulted' },
        ],
      },
      n2_called_police: {
        id: 'n2_called_police',
        situation: 'Police visited. The victim later reaches out to you and wants to leave. What do you help them do first?',
        choices: [
          { id: 'a', text: 'Help them create a safety plan — documents, essentials, safe place to go', next: 'n3_protection', correct: true },
          { id: 'b', text: 'Tell them to confront the abuser', next: 'n3_protection' },
          { id: 'c', text: 'Advise them to stay and work it out', next: null },
          { id: 'd', text: 'Call their family without asking the victim', next: 'n3_protection' },
        ],
      },
      n2_knocked: {
        id: 'n2_knocked',
        situation: 'The abuser answers the door aggressively and tells you to mind your business. The victim is visible behind them, looking scared. What do you do?',
        choices: [
          { id: 'a', text: 'Leave calmly, then call police immediately from a safe distance', next: 'n3_protection', correct: true },
          { id: 'b', text: 'Try to push past and check on the victim', next: 'n3_protection' },
          { id: 'c', text: 'Argue with the abuser', next: 'n3_protection' },
          { id: 'd', text: 'Leave and don\'t get involved further', next: null },
        ],
      },
      n2_ignored: {
        id: 'n2_ignored',
        situation: 'Weeks later, you learn the victim was hospitalised with serious injuries. You could have intervened earlier. What do you do now?',
        choices: [
          { id: 'a', text: 'Contact police and offer to be a witness about what you heard', next: null, correct: true },
          { id: 'b', text: 'Feel guilty but stay silent', next: null },
          { id: 'c', text: 'Visit the victim in hospital', next: null },
          { id: 'd', text: 'It\'s still not your business', next: null },
        ],
      },
      n2_consulted: {
        id: 'n2_consulted',
        situation: 'Other neighbours confirm they\'ve heard it too but no one has acted. Meanwhile, the violence continues tonight. What do you do?',
        choices: [
          { id: 'a', text: 'Call police now — enough consulting, someone needs to act', next: 'n3_protection', correct: true },
          { id: 'b', text: 'Write a collective letter to the abuser', next: null },
          { id: 'c', text: 'Contact the housing society / landlord', next: 'n3_protection' },
          { id: 'd', text: 'Wait for the victim to ask for help', next: null },
        ],
      },
      n3_protection: {
        id: 'n3_protection',
        situation: 'The victim is now safe. What legal protections should they seek?',
        choices: [
          { id: 'a', text: 'Apply for a protection order / restraining order through a magistrate or court', next: null, correct: true },
          { id: 'b', text: 'Only file a case if injuries are severe', next: null },
          { id: 'c', text: 'Wait to see if the abuser changes', next: null },
          { id: 'd', text: 'Settle it privately through family mediation', next: null },
        ],
      },
    },
  },
  theft: {
    title: 'Theft / Robbery',
    startNode: 'n1',
    nodes: {
      n1: {
        id: 'n1',
        situation: 'Someone snatches your bag and runs. You are uninjured. What do you do immediately?',
        choices: [
          { id: 'a', text: 'Note their description, direction, and call police immediately', next: 'n2_reported', correct: true },
          { id: 'b', text: 'Chase them down yourself', next: 'n2_chased' },
          { id: 'c', text: 'Post on social media asking for help', next: 'n2_posted' },
          { id: 'd', text: 'Accept the loss and move on', next: 'n2_accepted' },
        ],
      },
      n2_reported: {
        id: 'n2_reported',
        situation: 'Your phone was in the bag. What steps protect you from further harm?',
        choices: [
          { id: 'a', text: 'Remotely lock/wipe the phone, block SIM, and report IMEI to police', next: 'n3_pursue', correct: true },
          { id: 'b', text: 'Wait for the thief to contact you', next: 'n3_pursue' },
          { id: 'c', text: 'Only report if you have insurance', next: 'n3_pursue' },
          { id: 'd', text: 'Buy a new phone and forget it', next: null },
        ],
      },
      n2_chased: {
        id: 'n2_chased',
        situation: 'You chased them into an alley. They turn around and threaten you with a weapon. What do you do?',
        choices: [
          { id: 'a', text: 'Stop immediately, back away, and call police — your safety comes first', next: 'n3_pursue', correct: true },
          { id: 'b', text: 'Try to negotiate for your bag back', next: 'n3_pursue' },
          { id: 'c', text: 'Fight them for the bag', next: null },
          { id: 'd', text: 'Scream for help', next: 'n3_pursue' },
        ],
      },
      n2_posted: {
        id: 'n2_posted',
        situation: 'Your social media post gets attention but no leads. Meanwhile, the thief may be using your cards and phone. What do you do?',
        choices: [
          { id: 'a', text: 'Call your bank to block cards, lock phone remotely, and file a police report', next: 'n3_pursue', correct: true },
          { id: 'b', text: 'Wait for social media tips', next: null },
          { id: 'c', text: 'Offer a reward online', next: null },
          { id: 'd', text: 'Track your phone using Find My Device', next: 'n3_pursue' },
        ],
      },
      n2_accepted: {
        id: 'n2_accepted',
        situation: 'You accepted the loss. But your ID documents were in the bag. Identity theft is now a risk. What should you do?',
        choices: [
          { id: 'a', text: 'File a police report and alert all banks/services about potential identity fraud', next: null, correct: true },
          { id: 'b', text: 'Wait to see if anything suspicious happens', next: null },
          { id: 'c', text: 'Only worry about it if money goes missing', next: null },
          { id: 'd', text: 'Get new ID documents and move on', next: null },
        ],
      },
      n3_pursue: {
        id: 'n3_pursue',
        situation: 'You file a police report. They ask if you want to pursue the case. What should you consider?',
        choices: [
          { id: 'a', text: 'Yes — provide all evidence, CCTV footage requests, and witness details', next: null, correct: true },
          { id: 'b', text: 'No — it\'s too much effort for a small item', next: null },
          { id: 'c', text: 'Only if the item was expensive', next: null },
          { id: 'd', text: 'Ask for compensation from police instead', next: null },
        ],
      },
    },
  },
  cybercrime: {
    title: 'Cybercrime / Hacking',
    startNode: 'n1',
    nodes: {
      n1: {
        id: 'n1',
        situation: 'You notice unusual activity on your email — logins from unknown locations and sent emails you didn\'t write. What do you do first?',
        choices: [
          { id: 'a', text: 'Immediately change your password and enable 2FA from a secure device', next: 'n2_secured', correct: true },
          { id: 'b', text: 'Delete the suspicious emails', next: 'n2_deleted' },
          { id: 'c', text: 'Reply to the suspicious emails to investigate', next: 'n2_replied' },
          { id: 'd', text: 'Wait to see if it stops on its own', next: 'n2_waited' },
        ],
      },
      n2_secured: {
        id: 'n2_secured',
        situation: 'Your account is secured. You discover personal data was accessed. What next?',
        choices: [
          { id: 'a', text: 'Document everything, report to cybercrime cell, and notify affected services', next: 'n3_ransom', correct: true },
          { id: 'b', text: 'Only tell close friends', next: 'n3_ransom' },
          { id: 'c', text: 'Hire a hacker to find the attacker', next: null },
          { id: 'd', text: 'Do nothing if no financial loss occurred', next: 'n3_ransom' },
        ],
      },
      n2_deleted: {
        id: 'n2_deleted',
        situation: 'You deleted the emails, destroying evidence. The hacker still has access. More suspicious activity appears. What do you do?',
        choices: [
          { id: 'a', text: 'Change password and enable 2FA immediately — then report to cybercrime', next: 'n3_ransom', correct: true },
          { id: 'b', text: 'Delete more emails', next: null },
          { id: 'c', text: 'Create a new email account and abandon this one', next: null },
          { id: 'd', text: 'Contact your email provider', next: 'n3_ransom' },
        ],
      },
      n2_replied: {
        id: 'n2_replied',
        situation: 'By replying, you confirmed your account is active. The attacker now sends you a phishing link. What do you do?',
        choices: [
          { id: 'a', text: 'Do NOT click the link — change password immediately from a different device', next: 'n3_ransom', correct: true },
          { id: 'b', text: 'Click the link to see what it is', next: null },
          { id: 'c', text: 'Forward the email to friends to check', next: null },
          { id: 'd', text: 'Report the email as spam', next: 'n3_ransom' },
        ],
      },
      n2_waited: {
        id: 'n2_waited',
        situation: 'The hacker has now changed your password and locked you out. They\'re sending emails to your contacts. What do you do?',
        choices: [
          { id: 'a', text: 'Use account recovery, contact the email provider, and warn your contacts', next: 'n3_ransom', correct: true },
          { id: 'b', text: 'Create a new account and tell everyone', next: 'n3_ransom' },
          { id: 'c', text: 'Wait for the provider to notice', next: null },
          { id: 'd', text: 'Give up on the account', next: null },
        ],
      },
      n3_ransom: {
        id: 'n3_ransom',
        situation: 'You receive a ransom demand threatening to release your private data. What do you do?',
        choices: [
          { id: 'a', text: 'Do NOT pay — report to cybercrime authorities immediately with all evidence', next: null, correct: true },
          { id: 'b', text: 'Pay the ransom to make it stop', next: null },
          { id: 'c', text: 'Negotiate with the attacker', next: null },
          { id: 'd', text: 'Ignore it and hope they don\'t follow through', next: null },
        ],
      },
    },
  },
  fire_emergency: {
    title: 'Fire Emergency',
    startNode: 'n1',
    nodes: {
      n1: {
        id: 'n1',
        situation: 'You smell smoke in your apartment building. The fire alarm has not gone off. What do you do first?',
        choices: [
          { id: 'a', text: 'Alert others, activate the fire alarm manually, and call the fire department', next: 'n2_alerted', correct: true },
          { id: 'b', text: 'Investigate where the smoke is coming from', next: 'n2_investigated' },
          { id: 'c', text: 'Ignore it — it\'s probably cooking smoke', next: 'n2_ignored' },
          { id: 'd', text: 'Grab your valuables and leave quietly', next: 'n2_left_quietly' },
        ],
      },
      n2_alerted: {
        id: 'n2_alerted',
        situation: 'The alarm is ringing. You see smoke coming from under a neighbour\'s door. People are evacuating. What do you do?',
        choices: [
          { id: 'a', text: 'Do NOT open the door — feel it first. If hot, leave immediately via the nearest exit', next: 'n3_evacuated', correct: true },
          { id: 'b', text: 'Open the door to check if anyone is inside', next: 'n3_opened_door' },
          { id: 'c', text: 'Try to put out the fire yourself', next: 'n3_opened_door' },
          { id: 'd', text: 'Take the elevator to escape faster', next: 'n3_elevator' },
        ],
      },
      n2_investigated: {
        id: 'n2_investigated',
        situation: 'You find thick smoke in the hallway. Visibility is dropping fast. What do you do?',
        choices: [
          { id: 'a', text: 'Get low to the ground, cover your mouth, and crawl to the nearest exit', next: 'n3_evacuated', correct: true },
          { id: 'b', text: 'Run through the smoke to the stairwell', next: 'n3_evacuated' },
          { id: 'c', text: 'Go back to your apartment and wait for help', next: 'n3_trapped' },
          { id: 'd', text: 'Try to find the source of the fire', next: 'n3_opened_door' },
        ],
      },
      n2_ignored: {
        id: 'n2_ignored',
        situation: 'Minutes later, the smoke is thick and the fire alarm finally goes off. Flames are visible. You\'re now in danger. What do you do?',
        choices: [
          { id: 'a', text: 'Evacuate immediately — get low, cover mouth, use stairs not elevator', next: 'n3_evacuated', correct: true },
          { id: 'b', text: 'Gather your belongings first', next: 'n3_trapped' },
          { id: 'c', text: 'Try to fight the fire with water', next: 'n3_trapped' },
          { id: 'd', text: 'Open windows and wait for rescue', next: 'n3_trapped' },
        ],
      },
      n2_left_quietly: {
        id: 'n2_left_quietly',
        situation: 'You left without alerting anyone. Other residents are still inside unaware. What do you do now?',
        choices: [
          { id: 'a', text: 'Call the fire department immediately and alert the building from outside', next: 'n3_evacuated', correct: true },
          { id: 'b', text: 'You\'re safe — that\'s what matters', next: null },
          { id: 'c', text: 'Go back inside to warn people', next: 'n3_evacuated' },
          { id: 'd', text: 'Wait to see if it gets worse', next: null },
        ],
      },
      n3_evacuated: {
        id: 'n3_evacuated',
        situation: 'You\'re outside safely. A neighbour says their elderly parent is still inside on the 3rd floor. What do you do?',
        choices: [
          { id: 'a', text: 'Tell the fire department immediately — do NOT go back inside', next: null, correct: true },
          { id: 'b', text: 'Run back inside to rescue them', next: null },
          { id: 'c', text: 'Shout up to the window to tell them to come down', next: null },
          { id: 'd', text: 'Assume the firefighters will find them', next: null },
        ],
      },
      n3_opened_door: {
        id: 'n3_opened_door',
        situation: 'Opening the door caused a backdraft — flames burst out. You\'re burned and the hallway is now impassable. What do you do?',
        choices: [
          { id: 'a', text: 'Go to a room with a window, close the door, seal gaps with wet cloth, signal for help', next: null, correct: true },
          { id: 'b', text: 'Try to run through the flames', next: null },
          { id: 'c', text: 'Jump from the window', next: null },
          { id: 'd', text: 'Hide in a bathroom', next: null },
        ],
      },
      n3_elevator: {
        id: 'n3_elevator',
        situation: 'The elevator stops between floors due to the fire. You\'re trapped. What do you do?',
        choices: [
          { id: 'a', text: 'Press the emergency button and call for help — do not try to force the doors', next: null, correct: true },
          { id: 'b', text: 'Try to pry the doors open', next: null },
          { id: 'c', text: 'Try to climb out through the ceiling hatch', next: null },
          { id: 'd', text: 'Panic and scream', next: null },
        ],
      },
      n3_trapped: {
        id: 'n3_trapped',
        situation: 'You\'re trapped in your apartment. Smoke is seeping in. What do you do?',
        choices: [
          { id: 'a', text: 'Seal the door with wet towels, go to a window, and signal for help — call emergency services', next: null, correct: true },
          { id: 'b', text: 'Try to break through the wall', next: null },
          { id: 'c', text: 'Open the front door to escape', next: null },
          { id: 'd', text: 'Hide under the bed', next: null },
        ],
      },
    },
  },
  child_abuse: {
    title: 'Child Abuse / Neglect',
    startNode: 'n1',
    nodes: {
      n1: {
        id: 'n1',
        situation: 'You notice a child in your neighbourhood with frequent unexplained bruises. They seem fearful and withdrawn. What do you do?',
        choices: [
          { id: 'a', text: 'Report your concerns to child protective services / police', next: 'n2_reported', correct: true },
          { id: 'b', text: 'Confront the parents directly', next: 'n2_confronted' },
          { id: 'c', text: 'Mind your own business — it could be nothing', next: 'n2_ignored' },
          { id: 'd', text: 'Talk to the child directly and ask what\'s happening', next: 'n2_talked_child' },
        ],
      },
      n2_reported: {
        id: 'n2_reported',
        situation: 'You\'ve reported it. The authorities say they\'ll investigate. Meanwhile, you see the child again looking distressed. What do you do?',
        choices: [
          { id: 'a', text: 'Follow up with the authorities and document what you observe', next: 'n3_outcome', correct: true },
          { id: 'b', text: 'Assume the authorities are handling it', next: 'n3_outcome' },
          { id: 'c', text: 'Take the child away from the home yourself', next: 'n3_outcome' },
          { id: 'd', text: 'Confront the parents now that you\'ve reported', next: 'n3_outcome' },
        ],
      },
      n2_confronted: {
        id: 'n2_confronted',
        situation: 'The parents become hostile and deny everything. They threaten you and tell you to stay away. The child looks more scared. What do you do?',
        choices: [
          { id: 'a', text: 'Report to child protective services / police immediately — confrontation made it worse', next: 'n3_outcome', correct: true },
          { id: 'b', text: 'Back off — you tried', next: null },
          { id: 'c', text: 'Threaten to call the police on them', next: 'n3_outcome' },
          { id: 'd', text: 'Try to talk to them again more calmly', next: 'n3_outcome' },
        ],
      },
      n2_ignored: {
        id: 'n2_ignored',
        situation: 'Weeks later, the child is hospitalised with serious injuries. Neighbours are questioned. You knew something was wrong. What do you do?',
        choices: [
          { id: 'a', text: 'Tell the police everything you observed — your testimony could help protect the child', next: null, correct: true },
          { id: 'b', text: 'Stay silent — you don\'t want to get involved', next: null },
          { id: 'c', text: 'Feel guilty but say nothing', next: null },
          { id: 'd', text: 'Only speak if directly asked by police', next: null },
        ],
      },
      n2_talked_child: {
        id: 'n2_talked_child',
        situation: 'The child is too scared to say anything but starts crying. They beg you not to tell anyone. What do you do?',
        choices: [
          { id: 'a', text: 'Reassure them they\'re not in trouble, and report to authorities — the child\'s safety comes first', next: 'n3_outcome', correct: true },
          { id: 'b', text: 'Respect their wish and don\'t tell anyone', next: null },
          { id: 'c', text: 'Promise not to tell but secretly report', next: 'n3_outcome' },
          { id: 'd', text: 'Give them your phone number and tell them to call if it happens again', next: null },
        ],
      },
      n3_outcome: {
        id: 'n3_outcome',
        situation: 'Authorities are investigating. They ask if you\'re willing to provide a formal statement. What do you do?',
        choices: [
          { id: 'a', text: 'Yes — provide a detailed statement of everything you observed with dates and details', next: null, correct: true },
          { id: 'b', text: 'Give a vague statement to avoid getting too involved', next: null },
          { id: 'c', text: 'Refuse — you\'re scared of retaliation from the parents', next: null },
          { id: 'd', text: 'Only provide a written statement, not in person', next: null },
        ],
      },
    },
  },
  medical_emergency: {
    title: 'Heart Attack / Collapse',
    startNode: 'n1',
    nodes: {
      n1: {
        id: 'n1',
        situation: 'A person in a shopping mall suddenly clutches their chest and collapses. They are unresponsive. What do you do first?',
        choices: [
          { id: 'a', text: 'Check if they\'re responsive, call emergency services, and begin CPR if they\'re not breathing', next: 'n2_cpr', correct: true },
          { id: 'b', text: 'Shake them and shout to wake them up', next: 'n2_shook' },
          { id: 'c', text: 'Look for a doctor in the crowd', next: 'n2_looked_doctor' },
          { id: 'd', text: 'Don\'t touch them — you might make it worse', next: 'n2_didnt_touch' },
        ],
      },
      n2_cpr: {
        id: 'n2_cpr',
        situation: 'You\'ve started CPR. Someone says there\'s an AED (defibrillator) nearby. What do you do?',
        choices: [
          { id: 'a', text: 'Ask someone to get the AED while you continue CPR — don\'t stop compressions', next: 'n3_aed', correct: true },
          { id: 'b', text: 'Stop CPR and go get the AED yourself', next: 'n3_aed' },
          { id: 'c', text: 'Ignore the AED — CPR is enough', next: 'n3_waiting' },
          { id: 'd', text: 'Wait for paramedics to use the AED', next: 'n3_waiting' },
        ],
      },
      n2_shook: {
        id: 'n2_shook',
        situation: 'Shaking them didn\'t work. They\'re still unresponsive and not breathing normally. Precious seconds are passing. What do you do?',
        choices: [
          { id: 'a', text: 'Call emergency services and begin CPR immediately', next: 'n3_waiting', correct: true },
          { id: 'b', text: 'Pour water on their face', next: 'n3_waiting' },
          { id: 'c', text: 'Put them in the recovery position and wait', next: 'n3_waiting' },
          { id: 'd', text: 'Keep trying to wake them', next: 'n3_waiting' },
        ],
      },
      n2_looked_doctor: {
        id: 'n2_looked_doctor',
        situation: 'No doctor is found. The person has been on the ground for 2 minutes without help. Brain damage starts after 4 minutes. What do you do?',
        choices: [
          { id: 'a', text: 'Start CPR yourself — even untrained CPR is better than nothing', next: 'n3_waiting', correct: true },
          { id: 'b', text: 'Keep looking for medical staff', next: 'n3_waiting' },
          { id: 'c', text: 'Call emergency services and wait', next: 'n3_waiting' },
          { id: 'd', text: 'Ask the crowd if anyone knows CPR', next: 'n3_waiting' },
        ],
      },
      n2_didnt_touch: {
        id: 'n2_didnt_touch',
        situation: 'Nobody is helping. The person is turning blue. Every second without CPR reduces their chance of survival by 10%. What do you do?',
        choices: [
          { id: 'a', text: 'Overcome your fear and start chest compressions — push hard and fast on the centre of the chest', next: 'n3_waiting', correct: true },
          { id: 'b', text: 'Film it and call for help online', next: null },
          { id: 'c', text: 'Leave — you can\'t help', next: null },
          { id: 'd', text: 'Wait for someone braver to step in', next: 'n3_waiting' },
        ],
      },
      n3_aed: {
        id: 'n3_aed',
        situation: 'The AED has arrived. You\'ve never used one before. What do you do?',
        choices: [
          { id: 'a', text: 'Turn it on — it gives voice instructions. Follow them exactly. It\'s designed for untrained users', next: null, correct: true },
          { id: 'b', text: 'Don\'t use it — wait for paramedics', next: null },
          { id: 'c', text: 'Let someone else figure it out', next: null },
          { id: 'd', text: 'Read the manual first', next: null },
        ],
      },
      n3_waiting: {
        id: 'n3_waiting',
        situation: 'Paramedics arrive and take over. They ask what happened. What do you do?',
        choices: [
          { id: 'a', text: 'Tell them exactly what you observed — when they collapsed, what you did, how long it\'s been', next: null, correct: true },
          { id: 'b', text: 'Let others explain — you\'re too shaken', next: null },
          { id: 'c', text: 'Leave now that professionals are here', next: null },
          { id: 'd', text: 'Ask if the person will be okay', next: null },
        ],
      },
    },
  },
  stalking: {
    title: 'Stalking / Following',
    startNode: 'n1',
    nodes: {
      n1: {
        id: 'n1',
        situation: 'You notice the same person has been following you for the past 3 days — at the bus stop, near your workplace, and outside your home. What do you do?',
        choices: [
          { id: 'a', text: 'Document everything (photos, times, locations) and report to police immediately', next: 'n2_reported', correct: true },
          { id: 'b', text: 'Confront them directly and ask why they\'re following you', next: 'n2_confronted' },
          { id: 'c', text: 'Ignore it — maybe it\'s a coincidence', next: 'n2_ignored' },
          { id: 'd', text: 'Change your daily routine to avoid them', next: 'n2_changed_routine' },
        ],
      },
      n2_reported: {
        id: 'n2_reported',
        situation: 'Police have taken your report. The stalker is still appearing. What additional steps should you take?',
        choices: [
          { id: 'a', text: 'Apply for a restraining/protection order, inform trusted people, vary your routine', next: 'n3_safety', correct: true },
          { id: 'b', text: 'Wait for police to arrest them', next: 'n3_safety' },
          { id: 'c', text: 'Post about the stalker on social media with their photo', next: 'n3_safety' },
          { id: 'd', text: 'Hire a private investigator', next: 'n3_safety' },
        ],
      },
      n2_confronted: {
        id: 'n2_confronted',
        situation: 'They deny following you and become aggressive. You feel threatened. What do you do?',
        choices: [
          { id: 'a', text: 'Walk to a crowded public place immediately and call police', next: 'n3_safety', correct: true },
          { id: 'b', text: 'Argue with them', next: 'n3_safety' },
          { id: 'c', text: 'Run home', next: 'n3_safety' },
          { id: 'd', text: 'Threaten them back', next: null },
        ],
      },
      n2_ignored: {
        id: 'n2_ignored',
        situation: 'The stalking escalates. They\'re now sending you messages and showing up at your workplace. Colleagues are concerned. What do you do?',
        choices: [
          { id: 'a', text: 'Report to police with all evidence, inform your workplace security, and tell trusted people', next: 'n3_safety', correct: true },
          { id: 'b', text: 'Block them online and hope it stops', next: 'n3_safety' },
          { id: 'c', text: 'Respond to their messages to tell them to stop', next: null },
          { id: 'd', text: 'Move to a different city', next: null },
        ],
      },
      n2_changed_routine: {
        id: 'n2_changed_routine',
        situation: 'Despite changing your routine, they found your new route. They clearly know your schedule. What do you do?',
        choices: [
          { id: 'a', text: 'This is serious — report to police immediately with all documentation', next: 'n3_safety', correct: true },
          { id: 'b', text: 'Change routine again', next: null },
          { id: 'c', text: 'Ask a friend to accompany you everywhere', next: 'n3_safety' },
          { id: 'd', text: 'Install cameras at home and wait for more evidence', next: 'n3_safety' },
        ],
      },
      n3_safety: {
        id: 'n3_safety',
        situation: 'You have a police report filed. What ongoing safety measures should you maintain?',
        choices: [
          { id: 'a', text: 'Keep documenting, share your location with trusted contacts, vary routes, and follow up with police regularly', next: null, correct: true },
          { id: 'b', text: 'Relax — the police report will scare them off', next: null },
          { id: 'c', text: 'Buy a weapon for self-defence', next: null },
          { id: 'd', text: 'Delete all social media to disappear', next: null },
        ],
      },
    },
  },
  hit_and_run: {
    title: 'Hit and Run (Victim)',
    startNode: 'n1',
    nodes: {
      n1: {
        id: 'n1',
        situation: 'You are crossing the road legally when a car hits you and speeds away. You\'re on the ground, injured but conscious. What do you do first?',
        choices: [
          { id: 'a', text: 'Stay still, assess your injuries, and call emergency services immediately', next: 'n2_called', correct: true },
          { id: 'b', text: 'Try to get up and chase the car', next: 'n2_chased' },
          { id: 'c', text: 'Walk to the side of the road and sit down', next: 'n2_moved' },
          { id: 'd', text: 'Call a friend or family member first', next: 'n2_called_friend' },
        ],
      },
      n2_called: {
        id: 'n2_called',
        situation: 'Emergency services are on the way. Bystanders are gathering. What should you try to do while waiting?',
        choices: [
          { id: 'a', text: 'Ask bystanders if anyone saw the car — get the number plate, colour, make, and direction', next: 'n3_evidence', correct: true },
          { id: 'b', text: 'Just lie still and wait', next: 'n3_evidence' },
          { id: 'c', text: 'Post on social media asking for witnesses', next: 'n3_evidence' },
          { id: 'd', text: 'Try to remember the car details yourself', next: 'n3_evidence' },
        ],
      },
      n2_chased: {
        id: 'n2_chased',
        situation: 'You tried to get up but your leg gives way — you may have a fracture. Moving has made the injury worse. What do you do now?',
        choices: [
          { id: 'a', text: 'Stop moving, call emergency services, and ask bystanders for help', next: 'n3_evidence', correct: true },
          { id: 'b', text: 'Crawl to the pavement', next: 'n3_evidence' },
          { id: 'c', text: 'Ask someone to drive you to the hospital', next: 'n3_evidence' },
          { id: 'd', text: 'Wait for someone to notice you', next: 'n3_evidence' },
        ],
      },
      n2_moved: {
        id: 'n2_moved',
        situation: 'You moved to the side. You\'re in pain but stable. No one has called for help yet. What do you do?',
        choices: [
          { id: 'a', text: 'Call emergency services yourself and ask nearby people if they saw the car', next: 'n3_evidence', correct: true },
          { id: 'b', text: 'Wait for someone to help you', next: 'n3_evidence' },
          { id: 'c', text: 'Try to walk home', next: null },
          { id: 'd', text: 'Call a taxi to the hospital', next: 'n3_evidence' },
        ],
      },
      n2_called_friend: {
        id: 'n2_called_friend',
        situation: 'Your friend is 30 minutes away. You\'re bleeding and in pain on the road. What should you have done instead?',
        choices: [
          { id: 'a', text: 'Call emergency services — they respond in minutes, not 30 minutes', next: 'n3_evidence', correct: true },
          { id: 'b', text: 'Wait for your friend', next: 'n3_evidence' },
          { id: 'c', text: 'Ask a bystander to drive you to hospital', next: 'n3_evidence' },
          { id: 'd', text: 'Call another friend who is closer', next: 'n3_evidence' },
        ],
      },
      n3_evidence: {
        id: 'n3_evidence',
        situation: 'You\'re at the hospital. Police ask for details about the hit-and-run. What evidence is most important?',
        choices: [
          { id: 'a', text: 'Vehicle number plate, colour, make, direction of travel, time, location, and any witness contacts', next: null, correct: true },
          { id: 'b', text: 'Just describe the car colour', next: null },
          { id: 'c', text: 'Say you didn\'t see anything — you were in shock', next: null },
          { id: 'd', text: 'Ask the hospital to file the report for you', next: null },
        ],
      },
    },
  },
  workplace_injury: {
    title: 'Workplace Injury',
    startNode: 'n1',
    nodes: {
      n1: {
        id: 'n1',
        situation: 'A colleague falls from scaffolding at a construction site and is lying on the ground, conscious but in severe pain. What do you do first?',
        choices: [
          { id: 'a', text: 'Call emergency services, do NOT move them (possible spinal injury), and secure the area', next: 'n2_secured', correct: true },
          { id: 'b', text: 'Help them stand up', next: 'n2_moved_them' },
          { id: 'c', text: 'Run to get the first aid kit', next: 'n2_first_aid' },
          { id: 'd', text: 'Tell the supervisor first', next: 'n2_told_supervisor' },
        ],
      },
      n2_secured: {
        id: 'n2_secured',
        situation: 'Emergency services are on the way. Your supervisor tells you not to report this as a workplace accident to avoid trouble. What do you do?',
        choices: [
          { id: 'a', text: 'Refuse — this MUST be reported. Document everything and ensure an official accident report is filed', next: 'n3_legal', correct: true },
          { id: 'b', text: 'Agree with the supervisor to keep it quiet', next: 'n3_legal' },
          { id: 'c', text: 'Report it anonymously later', next: 'n3_legal' },
          { id: 'd', text: 'Let the injured colleague decide', next: 'n3_legal' },
        ],
      },
      n2_moved_them: {
        id: 'n2_moved_them',
        situation: 'You helped them up but they screamed — they have a spinal injury that may now be worse. What do you do?',
        choices: [
          { id: 'a', text: 'Lay them back down gently, call emergency services, and do NOT move them again', next: 'n3_legal', correct: true },
          { id: 'b', text: 'Carry them to a vehicle and drive to hospital', next: 'n3_legal' },
          { id: 'c', text: 'Give them painkillers', next: 'n3_legal' },
          { id: 'd', text: 'Ask them to try walking', next: null },
        ],
      },
      n2_first_aid: {
        id: 'n2_first_aid',
        situation: 'You got the first aid kit. The person is bleeding from the head but also complaining of back pain. What do you do?',
        choices: [
          { id: 'a', text: 'Apply pressure to the head wound but do NOT move their spine — call emergency services', next: 'n3_legal', correct: true },
          { id: 'b', text: 'Sit them up to treat the head wound', next: 'n3_legal' },
          { id: 'c', text: 'Focus only on the head wound', next: 'n3_legal' },
          { id: 'd', text: 'Give them water and wait', next: 'n3_legal' },
        ],
      },
      n2_told_supervisor: {
        id: 'n2_told_supervisor',
        situation: 'The supervisor is taking their time. The injured person is getting worse. What do you do?',
        choices: [
          { id: 'a', text: 'Call emergency services yourself — don\'t wait for permission to save a life', next: 'n3_legal', correct: true },
          { id: 'b', text: 'Wait for the supervisor to decide', next: 'n3_legal' },
          { id: 'c', text: 'Ask other colleagues what to do', next: 'n3_legal' },
          { id: 'd', text: 'Drive the person to hospital yourself', next: null },
        ],
      },
      n3_legal: {
        id: 'n3_legal',
        situation: 'The colleague is in hospital. What legal steps should be taken regarding the workplace accident?',
        choices: [
          { id: 'a', text: 'File an official accident report, document unsafe conditions, and ensure the colleague knows their right to workers\' compensation', next: null, correct: true },
          { id: 'b', text: 'Let the company handle it internally', next: null },
          { id: 'c', text: 'Only report if the colleague asks you to', next: null },
          { id: 'd', text: 'Post about unsafe conditions on social media', next: null },
        ],
      },
    },
  },
}

interface Props {
  scenarioId: string
  jurisdiction: string
  onComplete: (choices: { nodeId: string; choiceId: string; choiceText: string; wasCorrect: boolean; situation: string; correctChoiceText: string }[]) => void
  onBack: () => void
  loading: boolean
}

export default function SimulatorScenario({ scenarioId, jurisdiction, onComplete, onBack, loading }: Props) {
  const scenario = scenarios[scenarioId]
  const [currentNodeId, setCurrentNodeId] = useState<string>(scenario?.startNode || '')
  const [history, setHistory] = useState<{ nodeId: string; choiceId: string; choiceText: string; wasCorrect: boolean; situation: string; correctChoiceText: string }[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [stepCount, setStepCount] = useState(1)

  if (!scenario) return <div className="card text-center text-gray-500">Scenario not found.</div>

  const node = scenario.nodes[currentNodeId]
  if (!node) return <div className="card text-center text-gray-500">Scenario step not found.</div>

  const handleNext = () => {
    if (!selected) return
    const choice = node.choices.find(c => c.id === selected)
    if (!choice) return

    const correctChoice = node.choices.find(c => c.correct === true)
    const entry = {
      nodeId: node.id,
      choiceId: choice.id,
      choiceText: choice.text,
      wasCorrect: choice.correct === true,
      situation: node.situation,
      correctChoiceText: correctChoice ? correctChoice.text : choice.text,
    }
    const newHistory = [...history, entry]

    if (!choice.next) {
      // End of scenario
      onComplete(newHistory)
    } else {
      setHistory(newHistory)
      setCurrentNodeId(choice.next)
      setSelected(null)
      setStepCount(s => s + 1)
    }
  }

  const jLabel: Record<string, string> = { india: '🇮🇳 India', uk: '🇬🇧 UK', us: '🇺🇸 US' }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <span className="badge-blue text-xs">{scenario.title}</span>
        <span className="badge-purple text-xs">{jLabel[jurisdiction]}</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min((stepCount / 4) * 100, 100)}%` }} />
      </div>

      <div className="mb-2 text-sm text-gray-400">Situation {stepCount}</div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-gray-800 font-medium leading-relaxed">{node.situation}</p>
      </div>

      <h3 className="font-semibold text-gray-700 mb-3">What do you do?</h3>
      <div className="space-y-2 mb-6" key={currentNodeId}>
        {node.choices.map(c => (
          <button key={c.id} onClick={() => setSelected(c.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium
              ${selected === c.id ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-gray-200 hover:border-blue-300 text-gray-700'}`}>
            <span className="font-bold text-blue-500 mr-2">{c.id.toUpperCase()}.</span> {c.text}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Back
        </button>
        <button onClick={handleNext} disabled={!selected || loading}
          className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Evaluating...</> : 'Next'}
        </button>
      </div>
    </div>
  )
}
