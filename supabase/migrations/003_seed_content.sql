-- 14 daily quotes
insert into content_pieces (type, title, body, author, tags, is_daily, scheduled_for, reading_time_seconds) values
('quote', null, 'The most important thing is to not let the noise of the world drown out your own quiet knowing.', 'CAHS', '{"general","growth"}', true, current_date, 30),
('quote', null, 'Heartbreak is not a flaw in your design. It is proof that you loved something real.', 'CAHS', '{"heartbreak","healing"}', true, current_date + 1, 30),
('quote', null, 'You are allowed to be a work in progress and a masterpiece at the same time.', 'CAHS', '{"growth","self-compassion"}', true, current_date + 2, 30),
('quote', null, 'Loneliness is not the absence of people. It is the absence of being truly seen.', 'CAHS', '{"loneliness","connection"}', true, current_date + 3, 30),
('quote', null, 'Some days you survive. That is enough. That has always been enough.', 'CAHS', '{"overwhelmed","self-compassion"}', true, current_date + 4, 30),
('quote', null, 'What you carry in silence has weight. Writing it down does not solve it — but it makes it lighter.', 'CAHS', '{"expression","journaling"}', true, current_date + 5, 30),
('quote', null, 'Healing is not linear. It is messy and circular and sometimes you feel worse before you feel better. That is still healing.', 'CAHS', '{"healing","growth"}', true, current_date + 6, 30),
('quote', null, 'You do not need to perform your grief. You do not need to explain it. You are allowed to just feel it.', 'CAHS', '{"grief","heartbreak"}', true, current_date + 7, 30),
('quote', null, 'The version of you that made it through the last hard thing is quietly proud of you.', 'CAHS', '{"growth","courage"}', true, current_date + 8, 30),
('quote', null, 'Creativity is often just pain looking for a more beautiful shape.', 'CAHS', '{"creativity","expression"}', true, current_date + 9, 30),
('quote', null, 'Being anxious does not mean you are weak. It means your mind is working overtime to keep you safe. Thank it, then gently tell it to rest.', 'CAHS', '{"anxiety","self-compassion"}', true, current_date + 10, 30),
('quote', null, 'Some connections change you in ways that last longer than the connection itself.', 'CAHS', '{"heartbreak","loneliness"}', true, current_date + 11, 30),
('quote', null, 'Rest is not the reward at the end of the work. It is part of the work.', 'CAHS', '{"growth","boundaries"}', true, current_date + 12, 30),
('quote', null, 'You are not behind. You are on a path that only makes sense from where you are standing right now.', 'CAHS', '{"growth","anxiety"}', true, current_date + 13, 30);

-- 7 daily reflections
insert into content_pieces (type, title, body, author, tags, is_daily, scheduled_for, reading_time_seconds) values
('reflection', 'On the courage of staying soft',
'There is a particular kind of bravery in refusing to become hard. After enough hurt, the body learns to build walls. The mind starts to categorize people as threats before they''ve had a chance to be anything else. The heart, once open, draws back like a tide.

We call this self-protection, and it is — but it is also a cost. Because walls keep out pain and warmth in equal measure. Because a heart that cannot be hurt cannot fully love, and a love that cannot be fully felt is only half a life.

The courage I''m asking you to consider today is not the courage of the warrior. It''s the quieter, more difficult courage of the person who has been hurt — who knows exactly how badly it can hurt — and stays soft anyway.

This doesn''t mean being naive. It doesn''t mean trusting everyone or protecting yourself less. It means choosing not to let what others have done close the door on what might still be possible.

Staying soft in a hard world is one of the bravest things a person can do.',
'CAHS', '{"heartbreak","courage","healing"}', true, current_date, 180),

('reflection', 'What loneliness is trying to tell you',
'Loneliness has a terrible reputation. We treat it like a disease — something to be cured, medicated, scrolled away. We fill silence with noise, evenings with plans, weekends with people we don''t really want to see, because the alternative feels worse.

But what if loneliness isn''t the problem? What if loneliness is the signal?

Loneliness is your inner self saying: the connections you have aren''t feeding you. It''s not always about quantity. You can be in a relationship and be desperately lonely. You can be surrounded by friends and feel utterly unseen. The ache is not asking for more people — it''s asking for more depth.

Today, instead of trying to make the feeling go away, sit with it for a moment. Ask it: What kind of connection am I actually missing? Whose voice do I want to hear? Where do I feel most like myself?

The loneliness knows. It''s been trying to tell you.',
'CAHS', '{"loneliness","connection","growth"}', true, current_date + 1, 200),

('reflection', 'A letter to the version of you who is not okay right now',
'Dear you,

I know you''re not okay. I know you''ve been saying "I''m fine" so many times that you almost believe it. I know you''ve been functioning — going to work, replying to messages, making dinner — while something inside you is quietly crumbling.

You don''t have to be okay right now. You don''t have to have a plan or a timeline for when you''ll feel better. You don''t have to be productive with your pain.

Here is what I want you to know: the fact that you''re still here, still trying, still getting up in the morning — that is not nothing. That is everything. That is the quiet, unwitnessed heroism of ordinary survival.

Some days, surviving is the achievement. Some days, getting out of bed, taking a shower, eating something — those are the wins. And they count. They have always counted.

You are not behind. You are not broken. You are a person going through something hard, and you are handling it the only way you can: one moment at a time.

That is enough. You are enough.',
'CAHS', '{"healing","self-compassion","heartbreak"}', true, current_date + 2, 220),

('reflection', 'Why writing might be the one thing you need',
'There is something that happens when you write about something that has been living only in your head.

It becomes real. And in becoming real, it becomes separate from you. Not part of you anymore — something you can look at, examine, hold up to the light.

Before you write, the fear is shapeless. It fills every available space. It lives in your chest and your stomach and the 3am ceiling. But when you write it down — even badly, even in fragments — it takes a shape. And shapes can be understood. Shapes can be walked around.

This is not therapy. It is not a cure. But it is one of the oldest ways human beings have processed being alive. Every diary ever kept, every unsent letter, every poem scratched into the margins of a notebook — they all say the same thing: I was here. I felt this. And I am trying to make sense of it.

You don''t have to be a writer to write. You just have to be someone with something to say.',
'CAHS', '{"expression","journaling","growth"}', true, current_date + 3, 200),

('reflection', 'On the art of resting without guilt',
'Somewhere along the way, we learned that rest has to be earned. That you deserve to stop only after you''ve done enough, produced enough, been useful enough. That a free afternoon without a completed to-do list is a wasted one.

This is one of the most damaging ideas we carry, and most of us carry it so long we forget it''s an idea at all.

Rest is not a reward. It is a requirement. Like water, like sleep, like time with people who make you feel less alone — rest is not what you do after you''ve done enough. It is part of doing enough. It is what makes doing possible.

When you rest without guilt, you are not being lazy. You are being honest about what human beings actually need. You are choosing health over performance. You are saying: I matter enough to slow down.

Today, if you need to rest, rest. Not because you''ve earned it. Because you need it. And needing things is not a weakness — it is the most human thing there is.',
'CAHS', '{"growth","boundaries","self-compassion"}', true, current_date + 4, 190),

('reflection', 'The quiet grief of growing apart',
'Nobody tells you about the friendships that don''t end — they just slowly become something smaller, quieter, more distant. There''s no fight, no dramatic falling-out. Just longer gaps between messages, plans that keep getting postponed, conversations that used to run for hours now lasting twenty minutes.

And one day you realize: you have grown in different directions. The person who knew you so well once doesn''t quite know the person you are now. And you don''t quite know them either.

This is a real grief, even without a clean ending. It deserves to be acknowledged as loss.

But here''s what I want to say gently: growing apart is not a failure. People are not static. We grow, we change, our needs evolve. Sometimes the most honest thing a friendship can do is quietly make space for you both to become who you''re meant to be — even if that means becoming it in different directions.

The love was real. The time was real. The version of you who needed that friendship was real. None of that becomes less true because the seasons changed.',
'CAHS', '{"loneliness","heartbreak","grief"}', true, current_date + 5, 210),

('reflection', 'Permission to feel all of it',
'Here is your permission slip, written in whatever ink you need it in:

You are allowed to be sad about something small. You are allowed to feel devastated by something others would call minor. You do not need to rank your pain against someone else''s. You do not need to feel grateful that it wasn''t worse before you are allowed to feel that it was bad.

You are allowed to be angry. And sad. At the same time, at different times, at things that happened years ago that you thought you were over.

You are allowed to not be over it.

You are allowed to have a good day and then a terrible night and not know why. You are allowed to feel hopeful and hopeless in the same week. You are allowed to laugh at something while grieving something else.

Feelings are not a queue that processes one at a time. They are a weather system. They don''t make sense, and they don''t have to.

You are allowed to feel all of it. Every contradictory, inconvenient, overwhelming bit of it. That is not weakness. That is what it means to be alive.',
'CAHS', '{"healing","self-compassion","general"}', true, current_date + 6, 185);

-- Some library content (non-daily)
insert into content_pieces (type, title, body, author, tags, is_daily, reading_time_seconds) values
('poem', 'Still Here',
'I have not become
who I thought I would be by now.

The road bent early
and I bent with it,

and now I am here —
not where I planned,

but here,
which is somewhere,

which is more
than I sometimes remember.',
'CAHS', '{"growth","healing"}', false, 60),

('letter', 'To the person who stayed up too late thinking',
'I see you. Still awake, still turning it over, still trying to figure out what you could have done differently, what it meant, what comes next.

Your brain is trying to protect you. It thinks if it can just understand enough, control enough, predict enough — it can prevent the next hurt.

It can''t. But it doesn''t know that yet. So it keeps going.

Gently, as gently as you can: tell it to stop. Not forever. Just for tonight.

The answers you''re looking for won''t come from thinking harder. They come from rest, from time, from the morning after a night you actually slept.

Put it down. You can pick it up again tomorrow if you still need to.

But chances are, by morning, it will be a little lighter.',
'CAHS', '{"anxiety","loneliness","healing"}', false, 90),

('lesson', 'What therapists know about grief that nobody tells you',
'Grief does not move in stages. The idea that grief goes shock → denial → anger → bargaining → acceptance is a framework, not a map. You will not move through these in order. You will visit some of them multiple times. You will skip others entirely.

Grief is not something you get over. It is something you carry, and it changes as you do. The weight does not disappear — you get stronger, the weight gets familiar, you find better ways to carry it.

There is no timeline. Six months is not too long. Three years is not too long. The people who tell you you should be over it by now are not grieving what you are grieving.

Grief and love are the same thing. The size of your grief is a measure of how much something mattered. You do not need to be ashamed of either.',
'CAHS', '{"grief","healing","heartbreak"}', false, 120);
