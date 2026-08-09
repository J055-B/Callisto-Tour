// The welcome email's HTML — inline-styled and table-based (email-client
// safe), matching the app's dark/gold branding. Rendered inside an iframe
// for the preview modal, and copied to the clipboard as real HTML so
// pasting into Gmail keeps the formatting (colors, layout, bold/italic)
// instead of dumping plain text. See WelcomeEmailButton.tsx.
export const WELCOME_EMAIL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Tour de Callisto — Welcome Email</title>
</head>
<body style="margin:0;padding:0;background:#e9e9e9;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9e9e9;padding:32px 0;">
<tr><td align="center">

<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:#05090B;border-radius:12px;overflow:hidden;">

  <tr>
    <td style="background:#0B1114;padding:40px 40px 32px 40px;text-align:center;position:relative;">
      <div style="font-size:12px;letter-spacing:4px;color:#8B999F;margin-bottom:14px;">&#10022; &nbsp; A U G U S T &nbsp; 2 0 2 6 &nbsp; E D I T I O N &nbsp; &#10022;</div>
      <div style="font-size:38px;font-weight:bold;font-style:italic;color:#F4F7F8;line-height:1.15;">
        TOUR DE <span style="color:#FFD400;">CALLISTO</span>
      </div>
      <div style="font-size:15px;color:#8B999F;margin-top:10px;letter-spacing:1px;">
        &#9733; &nbsp;POWER. SPEED. FAME. BE A LEGEND.&nbsp; &#9733;
      </div>
      <div style="height:2px;width:120px;background:#FFD400;margin:22px auto 0 auto;"></div>
    </td>
  </tr>

  <tr>
    <td style="padding:36px 40px 8px 40px;color:#F4F7F8;">
      <p style="font-size:16px;line-height:1.6;margin:0 0 16px 0;">Dear team,</p>
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px 0;color:#D7DCDE;">
        Fresh off the incredible energy of our Inter-Branch World Cup, we're throwing down the next challenge —
        and this one takes us around the entire world.
      </p>
      <p style="font-size:20px;line-height:1.5;margin:0 0 4px 0;color:#FFD400;font-weight:bold;font-style:italic;">
        This isn't just another sales competition.
      </p>
      <p style="font-size:16px;line-height:1.8;margin:0;color:#D7DCDE;">
        Every sale becomes kilometres. Every percentage moves your team forward. Every single day has the power
        to flip the entire leaderboard.
      </p>
    </td>
  </tr>

  <tr>
    <td style="padding:24px 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#10181C;border:1px solid #1D292F;border-radius:10px;">
        <tr>
          <td style="padding:18px 24px;text-align:center;" width="33%">
            <div style="font-size:11px;color:#8B999F;letter-spacing:2px;">STARTS</div>
            <div style="font-size:18px;color:#F4F7F8;font-weight:bold;margin-top:4px;">AUG 10</div>
          </td>
          <td style="padding:18px 0;text-align:center;color:#FFD400;font-size:20px;" width="1%">&#8594;</td>
          <td style="padding:18px 24px;text-align:center;" width="33%">
            <div style="font-size:11px;color:#8B999F;letter-spacing:2px;">ENDS</div>
            <div style="font-size:18px;color:#F4F7F8;font-weight:bold;margin-top:4px;">AUG 31</div>
          </td>
          <td style="padding:18px 0;text-align:center;color:#1D292F;font-size:20px;" width="1%">|</td>
          <td style="padding:18px 24px;text-align:center;" width="33%">
            <div style="font-size:11px;color:#8B999F;letter-spacing:2px;">TEAMS</div>
            <div style="font-size:18px;color:#F4F7F8;font-weight:bold;margin-top:4px;">12 WORLDWIDE</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding:20px 40px 8px 40px;">
      <div style="font-size:12px;letter-spacing:3px;color:#FFD400;font-weight:bold;margin-bottom:10px;">&#9733; HOW IT WORKS</div>
      <p style="font-size:15px;line-height:1.8;margin:0 0 14px 0;color:#D7DCDE;">
        Each stage is <b style="color:#F4F7F8;">1,000 km = 100% of your daily target.</b> Every 1% you hit moves
        your team <b style="color:#F4F7F8;">10 km</b> down the route. Blow past 100%? Keep going — there's no
        ceiling. Finish the loop around the world? <b style="color:#F4F7F8;">Lap 2 starts immediately.</b> The race
        never stops until the final day.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px 0;">
        <tr>
          <td style="background:#10181C;border:1px solid #1D292F;border-radius:8px;padding:10px 16px;font-size:13px;color:#8B999F;">80% <span style="color:#4a4f52;">&#8594;</span> <span style="color:#F4F7F8;">800 km</span></td>
          <td style="width:10px;"></td>
          <td style="background:#10181C;border:1px solid #1D292F;border-radius:8px;padding:10px 16px;font-size:13px;color:#8B999F;">100% <span style="color:#4a4f52;">&#8594;</span> <span style="color:#F4F7F8;">1,000 km</span></td>
          <td style="width:10px;"></td>
          <td style="background:#10181C;border:1px solid #1D292F;border-radius:8px;padding:10px 16px;font-size:13px;color:#8B999F;">130% <span style="color:#4a4f52;">&#8594;</span> <span style="color:#FFD400;font-weight:bold;">1,300 km</span></td>
        </tr>
      </table>

      <div style="background:linear-gradient(90deg,rgba(255,212,0,0.10),rgba(255,212,0,0.02));border:1px solid rgba(255,212,0,0.35);border-radius:10px;padding:16px 20px;margin-bottom:8px;">
        <div style="font-size:13px;font-weight:bold;color:#FFD400;letter-spacing:1px;margin-bottom:6px;">&#9889; WEEKEND POWER STAGES</div>
        <p style="font-size:14px;line-height:1.7;margin:0;color:#D7DCDE;">
          Weekends hit different. Power Stage 1 &amp; 2 pay <b style="color:#F4F7F8;">15 km per 1%</b> — a perfect
          100% is <b style="color:#F4F7F8;">1,500 km</b>. The Final Power Stage pays <b style="color:#F4F7F8;">12.5 km per 1%</b>.
          One strong weekend can completely flip the board — nobody is ever really out of it.
        </p>
      </div>
    </td>
  </tr>

  <tr>
    <td style="padding:28px 40px 8px 40px;">
      <div style="font-size:12px;letter-spacing:3px;color:#FFD400;font-weight:bold;margin-bottom:14px;">&#9733; TWO WAYS TO WIN</div>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="48%" style="background:#10181C;border:1px solid #FFD400;border-radius:10px;padding:20px;vertical-align:top;">
            <div style="font-size:22px;">&#127942;</div>
            <div style="font-size:15px;font-weight:bold;color:#F4F7F8;margin-top:6px;">Tour Champion</div>
            <div style="font-size:12px;color:#8B999F;margin-top:2px;">Greatest total distance, wins it all</div>
            <div style="font-size:26px;font-weight:bold;color:#FFD400;margin-top:12px;">&#8364;1,000</div>
            <div style="font-size:12px;color:#8B999F;margin-top:6px;line-height:1.5;">Funded by the pack — the winning team keeps every cent.</div>
          </td>
          <td width="4%"></td>
          <td width="48%" style="background:#10181C;border:1px solid #1D292F;border-radius:10px;padding:20px;vertical-align:top;">
            <div style="font-size:22px;">&#11088;</div>
            <div style="font-size:15px;font-weight:bold;color:#F4F7F8;margin-top:6px;">Weekly Winner</div>
            <div style="font-size:12px;color:#8B999F;margin-top:2px;">Fresh race, every single Monday</div>
            <div style="font-size:15px;font-weight:bold;color:#2DD4BF;margin-top:12px;">Team night out</div>
            <div style="font-size:12px;color:#8B999F;margin-top:6px;line-height:1.5;">Dinner, bowling, karting — winner's choice. Standings reset weekly, so everyone gets a new shot.</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding:30px 40px 10px 40px;text-align:center;">
      <p style="font-size:15px;line-height:1.7;color:#D7DCDE;margin:0 0 18px 0;">
        Jump into the live leaderboard, watch your team's dot move across the map, and give it everything you've got.
      </p>
      <a href="#" style="display:inline-block;background:#FFD400;color:#05090B;font-weight:bold;font-size:15px;padding:14px 36px;border-radius:999px;text-decoration:none;">
        OPEN THE LIVE LEADERBOARD &#8594;
      </a>
    </td>
  </tr>

  <tr>
    <td style="padding:34px 40px 40px 40px;text-align:center;border-top:1px solid #1D292F;margin-top:20px;">
      <div style="font-size:12px;color:#8B999F;letter-spacing:2px;margin-bottom:10px;">&#10022; &nbsp; &#10022; &nbsp; &#10022;</div>
      <div style="font-size:26px;font-weight:bold;font-style:italic;color:#FFD400;letter-spacing:1px;line-height:1.4;">
        BE BRAVE.<br/>GO FASTER.<br/>BE THE LEGEND.
      </div>
      <div style="font-size:13px;color:#8B999F;margin-top:18px;">— The Tour de Callisto Team</div>
    </td>
  </tr>

</table>

</td></tr>
</table>
</body>
</html>`

export const WELCOME_EMAIL_SUBJECT = 'Tour de Callisto begins August 10 — are you ready to ride?'
