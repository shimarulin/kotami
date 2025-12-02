## Brief overview
This set of guidelines is project-specific for the kotami project, establishing standards for using RFC 2119 keywords in all project documentation (README, comments, API docs, etc.) to ensure precise and consistent communication of requirements, recommendations, and options.

## RFC 2119 Keywords
- "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT" indicate absolute requirements or prohibitions that must be followed
- "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED" indicate recommendations that may be ignored only after careful consideration of implications
- "MAY", "OPTIONAL" indicate features that are truly optional and may or may not be implemented depending on needs

## Usage Rules
- RFC 2119 keywords are written in UPPERCASE to indicate their special meaning
- When these words are written in lowercase, they have their normal English usage meaning
- Always reference RFC 2119 when introducing these guidelines in documentation

## Reference
The keywords "MUST", "MUST NOT", "REQUIRED", "RECOMMENDED", and "OPTIONAL" in project documentation are to be interpreted as described in RFC 2119: Key words for use in RFCs to Indicate Requirement Levels ([RFC 2119](http://www.ietf.org/rfc/rfc2119.txt)).

## Examples
- Correct: "The configuration file MUST be in JSON format."
- Incorrect (normal English): "You must update the dependencies." (use "should" or rephrase if not absolute requirement)
- Optional: "The UI MAY include dark mode support."

## Language Requirements
All project documentation (README, comments, API documentation, etc.) MUST be written in English.
