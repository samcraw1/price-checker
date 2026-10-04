import type { Email } from './types'

// Temporary fake data until the Gmail backend exists.
export const MOCK_EMAILS: Email[] = [
  {
    id: '1',
    snippet: 'Your Claude Pro subscription renewed for $20.00.',
    sentFrom: 'Anthropic <no-reply@anthropic.com>',
    sentTo: 'samcraw01@gmail.com',
    subject: 'Your receipt from Anthropic',
    body: '<h2 style="font-family:sans-serif">Thanks for your payment</h2><p style="font-family:sans-serif">Your Claude Pro subscription renewed for $20.00.</p>',
    sentAt: '2026-10-03T09:15:00Z',
  },
  {
    id: '2',
    snippet: 'The workflow CI failed on main.',
    sentFrom: 'GitHub <noreply@github.com>',
    sentTo: 'samcraw01@gmail.com',
    subject: '[price-checker] Run failed: CI',
    body: '<p style="font-family:sans-serif">The workflow <b>CI</b> failed on <code>main</code>.</p><p><a href="#">View run</a></p>',
    sentAt: '2026-10-02T21:40:00Z',
  },
  {
    id: '3',
    snippet: 'Are you free Friday around noon? Thinking tacos.',
    sentFrom: 'Alex Rivera <alex@example.com>',
    sentTo: 'samcraw01@gmail.com',
    cc: 'jamie@example.com',
    subject: 'Lunch Friday?',
    body: '<p style="font-family:sans-serif">Hey Sam,<br><br>Are you free Friday around noon? Thinking tacos.<br><br>- Alex</p>',
    sentAt: '2026-10-02T16:05:00Z',
  },
  {
    id: '4',
    snippet: 'Your deployment is live at price-checker.vercel.app.',
    sentFrom: 'Vercel <notifications@vercel.com>',
    sentTo: 'samcraw01@gmail.com',
    subject: 'Deployment ready: price-checker',
    body: '<p style="font-family:sans-serif">Your deployment is live at <a href="#">price-checker.vercel.app</a>.</p>',
    sentAt: '2026-10-01T12:30:00Z',
  },
  {
    id: '5',
    snippet: 'We would love to schedule a call next week.',
    sentFrom: 'Recruiter <jobs@acme.com>',
    sentTo: 'samcraw01@gmail.com',
    subject: 'Interview invitation: Software Engineer',
    body: '<p style="font-family:sans-serif">Hi Sam,<br><br>We would love to schedule a call next week. Please reply with your availability.<br><br>Best,<br>Acme Recruiting</p>',
    sentAt: '2026-09-30T08:00:00Z',
  },
]
