/**
 * SVG Sprite Sheet — hidden definitions referenced via <use href="#icon-name" />.
 * Eliminates duplicate inline SVG markup across pages (~35 KB savings).
 *
 * Add to <body> once (in __root.tsx) with display:none.
 * Use via <SpriteIcon name="arrow-right" /> component.
 */
export function SvgSprite() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      aria-hidden="true"
    >
      <defs>
        {/* IconArrowRight */}
        <symbol id="sprite-arrow-right" viewBox="0 0 24 24" fill="none">
          <path d="M14 6L20 12L14 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>

        {/* IconCheckmark1 */}
        <symbol id="sprite-checkmark" viewBox="0 0 24 24" fill="none">
          <path d="M5 12.75L10 19L19 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>

        {/* IconGlobe */}
        <symbol id="sprite-globe" viewBox="0 0 24 24" fill="none">
          <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          <path d="M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          <path d="M12 21C10.067 21 8.5 16.9706 8.5 12C8.5 7.02944 10.067 3 12 3C13.933 3 15.5 7.02944 15.5 12C15.5 16.9706 13.933 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
        </symbol>

        {/* IconRocket */}
        <symbol id="sprite-rocket" viewBox="0 0 24 24" fill="none">
          <path d="M3 21H5C6.10457 21 7 20.1046 7 19C7 17.8954 6.10457 17 5 17C3.89543 17 3 17.8954 3 19V21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M7.00098 13H4.76717C3.98987 13 3.50976 12.152 3.90968 11.4855L5.41837 8.97101C5.77982 8.3686 6.43083 8 7.13336 8H11.251C13.7671 5.25513 16.4925 3.3474 20.0017 3.04278C20.5519 2.99502 21.006 3.44906 20.9582 3.99927C20.6536 7.50845 18.7459 10.2339 16.001 12.75V16.8676C16.001 17.5701 15.6324 18.2212 15.03 18.5826L12.5155 20.0913C11.849 20.4912 11.001 20.0111 11.001 19.2338V17L7.00098 13Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M7 13L11.25 8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M16 12.75L11 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </symbol>

        {/* IconCodeBrackets */}
        <symbol id="sprite-code-brackets" viewBox="0 0 24 24" fill="none">
          <path d="M10 20L14 4M18 8.00004L20.5858 10.5858C21.3668 11.3669 21.3668 12.6332 20.5858 13.4143L18 16M6 16L3.41421 13.4143C2.63316 12.6332 2.63317 11.3669 3.41421 10.5858L6 8.00004" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>

        {/* IconGroup1 */}
        <symbol id="sprite-group" viewBox="0 0 24 24" fill="none">
          <path d="M9 10C7.067 10 5.5 8.433 5.5 6.5C5.5 4.567 7.067 3 9 3C10.933 3 12.5 4.567 12.5 6.5C12.5 8.433 10.933 10 9 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 3C16.933 3 18.5 4.567 18.5 6.5C18.5 8.433 16.933 10 15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.00136 13C5.36308 13 2.29205 15.1251 1.32114 18.0342C0.971437 19.0819 1.89679 20 3.00136 20H15.0014C16.1059 20 17.0313 19.0819 16.6816 18.0342C15.7107 15.1251 12.6396 13 9.00136 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20.5 20H21C22.1046 20 23.0299 19.082 22.6803 18.0343C21.9925 15.9734 20.2507 14.306 18 13.5088" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>

        {/* IconZap */}
        <symbol id="sprite-zap" viewBox="0 0 24 24" fill="none">
          <path d="M19.5657 9H13.5C13.2239 9 13 8.77614 13 8.5V2.40139C13 1.90668 12.3584 1.71242 12.084 2.12404L4.01823 14.2226C3.79672 14.5549 4.03491 15 4.43426 15H10.5C10.7761 15 11 15.2239 11 15.5V21.5986C11 22.0933 11.6416 22.2876 11.916 21.876L19.9818 9.77735C20.2033 9.44507 19.9651 9 19.5657 9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </symbol>

        {/* IconSettingsGear1 */}
        <symbol id="sprite-settings-gear" viewBox="0 0 24 24" fill="none">
          <path d="M18.9805 6.92648L12.9805 3.55152C12.3717 3.20906 11.6283 3.20906 11.0195 3.55152L5.01949 6.92646C4.38973 7.28069 4 7.94707 4 8.66962V15.3305C4 16.0531 4.38975 16.7194 5.01954 17.0737L11.0195 20.4484C11.6283 20.7908 12.3717 20.7908 12.9805 20.4483L18.9805 17.0734C19.6103 16.7192 20 16.0528 20 15.3302V8.66964C20 7.94709 19.6103 7.28072 18.9805 6.92648Z" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
          <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
        </symbol>

        {/* IconMagnifyingGlass */}
        <symbol id="sprite-magnifying-glass" viewBox="0 0 24 24" fill="none">
          <path d="M11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M20 20L16.05 16.05" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </symbol>

        {/* IconSparklesSoft */}
        <symbol id="sprite-sparkles-soft" viewBox="0 0 24 24" fill="none">
          <path d="M19 13C14.0987 13.4243 11.4243 16.0987 11 21C10.5578 16.0225 7.89737 13.5547 3 13C7.97478 12.4262 10.4262 9.97478 11 5C11.5547 9.89737 14.0225 12.5578 19 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.8864 2.34512C18.8642 2.14869 18.6981 2.0002 18.5004 2C18.3027 1.9998 18.1363 2.14794 18.1137 2.34433C18.0082 3.25861 17.7367 3.88584 17.3113 4.31127C16.8858 4.7367 16.2586 5.00822 15.3443 5.11367C15.1479 5.13632 14.9998 5.30271 15 5.5004C15.0002 5.69809 15.1487 5.86417 15.3451 5.88642C16.2439 5.98823 16.8855 6.25969 17.3217 6.68804C17.7556 7.11407 18.0322 7.74041 18.1126 8.64552C18.1305 8.84634 18.2988 9.00023 18.5004 9C18.702 8.99977 18.8701 8.84551 18.8874 8.64465C18.9645 7.75483 19.2409 7.11438 19.6776 6.67764C20.1144 6.24091 20.7548 5.96446 21.6446 5.88744C21.8455 5.87005 21.9998 5.70205 22 5.50044C22.0002 5.29883 21.8463 5.13048 21.6455 5.11264C20.7404 5.03224 20.1141 4.75557 19.688 4.3217C19.2597 3.88545 18.9882 3.24394 18.8864 2.34512Z" fill="currentColor" />
        </symbol>

        {/* IconChevronRight */}
        <symbol id="sprite-chevron-right" viewBox="0 0 24 24" fill="none">
          <path d="M9 4L15.5858 10.5858C16.3668 11.3668 16.3668 12.6331 15.5858 13.4142L9 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>

        {/* IconChart1 */}
        <symbol id="sprite-chart" viewBox="0 0 24 24" fill="none">
          <path d="M21 16V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 13V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 11V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15.1445 18.5L16.0017 21.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8.85714 18.5L8 21.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>

        {/* IconShieldCheck */}
        <symbol id="sprite-shield-check" viewBox="0 0 24 24" fill="none">
          <path d="M9.5 11.75L11 13.25L14.5 9.75M20 11.9123V7.17737C20 6.32338 19.4578 5.56361 18.6502 5.286L12.6502 3.2235C12.2288 3.07866 11.7712 3.07866 11.3498 3.22349L5.34984 5.286C4.54224 5.56361 4 6.32338 4 7.17737V11.9123C4 16.8848 8 19 12 21.1579C16 19 20 16.8848 20 11.9123Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>

        {/* IconGithub */}
        <symbol id="sprite-github" viewBox="0 0 24 24">
          <path d="M12 1.95068C17.525 1.95068 22 6.42568 22 11.9507C21.9995 14.0459 21.3419 16.0883 20.1198 17.7902C18.8977 19.4922 17.1727 20.768 15.1875 21.4382C14.6875 21.5382 14.5 21.2257 14.5 20.9632C14.5 20.6257 14.5125 19.5507 14.5125 18.2132C14.5125 17.2757 14.2 16.6757 13.8375 16.3632C16.0625 16.1132 18.4 15.2632 18.4 11.4257C18.4 10.3257 18.0125 9.43818 17.375 8.73818C17.475 8.48818 17.825 7.46318 17.275 6.08818C17.275 6.08818 16.4375 5.81318 14.525 7.11318C13.725 6.88818 12.875 6.77568 12.025 6.77568C11.175 6.77568 10.325 6.88818 9.525 7.11318C7.6125 5.82568 6.775 6.08818 6.775 6.08818C6.225 7.46318 6.575 8.48818 6.675 8.73818C6.0375 9.43818 5.65 10.3382 5.65 11.4257C5.65 15.2507 7.975 16.1132 10.2 16.3632C9.9125 16.6132 9.65 17.0507 9.5625 17.7007C8.9875 17.9632 7.55 18.3882 6.65 16.8757C6.4625 16.5757 5.9 15.8382 5.1125 15.8507C4.275 15.8632 4.775 16.3257 5.125 16.5132C5.55 16.7507 6.0375 17.6382 6.15 17.9257C6.35 18.4882 7 19.5632 9.5125 19.1007C9.5125 19.9382 9.525 20.7257 9.525 20.9632C9.525 21.2257 9.3375 21.5257 8.8375 21.4382C6.8458 20.7752 5.11342 19.502 3.88611 17.799C2.65881 16.096 1.9989 14.0498 2 11.9507C2 6.42568 6.475 1.95068 12 1.95068Z" fill="currentColor" />
        </symbol>

        {/* IconRobot */}
        <symbol id="sprite-robot" viewBox="0 0 24 24" fill="none">
          <path d="M9 10C9 10.2761 8.77614 10.5 8.5 10.5C8.22386 10.5 8 10.2761 8 10M9 10C9 9.72386 8.77614 9.5 8.5 9.5C8.22386 9.5 8 9.72386 8 10M9 10H8M16 10C16 10.2761 15.7761 10.5 15.5 10.5C15.2239 10.5 15 10.2761 15 10M16 10C16 9.72386 15.7761 9.5 15.5 9.5C15.2239 9.5 15 9.72386 15 10M16 10H15M12 5V3M3.5 9C2.94772 9 2.5 9.44772 2.5 10C2.5 10.5523 2.94772 11 3.5 11M20.5 9C21.0523 9 21.5 9.44772 21.5 10C21.5 10.5523 21.0523 11 20.5 11M10 14.5H14M3.5 16V7C3.5 5.89543 4.39543 5 5.5 5H18.5C19.6046 5 20.5 5.89543 20.5 7V16C20.5 17.6569 19.1569 19 17.5 19H6.5C4.84315 19 3.5 17.6569 3.5 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>

        {/* IconApiConnection */}
        <symbol id="sprite-api-connection" viewBox="0 0 24 24" fill="none">
          <path d="M4 12C4 16.4183 7.58172 20 12 20C14.9611 20 17.5465 18.3912 18.9297 16M4 12C4 7.58172 7.58172 4 12 4C14.9611 4 17.5465 5.60879 18.9297 8M4 12H2M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12ZM16 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>

        {/* IconScript */}
        <symbol id="sprite-script" viewBox="0 0 24 24" fill="none">
          <path d="M7 15.4996C7 15.4996 7 8.27504 7 5.9964C7 5.46648 7.21052 4.95846 7.58617 4.58406C7.96104 4.20966 8.46974 4 9.00035 4C12.1715 4 18 4 18 4" stroke="currentColor" strokeWidth="2" strokeMiterlimit="1.5" strokeLinecap="square" strokeLinejoin="round" />
          <path d="M13.9974 20L6.0329 20C5.49368 20 4.97658 19.7859 4.59526 19.4047C4.21395 19.0235 4 18.5063 4 17.9675C4 17.8101 4 17.6529 4 17.5C4 16.6715 4.672 16 5.50043 16C7.67466 16 9.32534 16 11.4996 16C12.328 16 13 16.6716 13 17.5L13 18.002C13 19.105 13.895 20 14.998 20H15.002C16.105 20 17 19.105 17 18.002V9" stroke="currentColor" strokeWidth="2" strokeMiterlimit="1.5" strokeLinecap="square" strokeLinejoin="round" />
          <path fillRule="evenodd" clipRule="evenodd" d="M19 4C19.5304 4 20.0393 4.21077 20.4143 4.58585C20.7892 4.96092 21 5.46954 21 6C21 6.5005 21 7.02884 21 7.50032C21 8.32874 20.3284 9 19.5 9H17V6C17 5.46954 17.2108 4.96092 17.5857 4.58585C17.9607 4.21077 18.4696 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 8H13" stroke="currentColor" strokeWidth="2" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 12H12" stroke="currentColor" strokeWidth="2" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>

        {/* IconCode */}
        <symbol id="sprite-code" viewBox="0 0 24 24" fill="none">
          <path d="M10 9.5L8.20711 11.2929C7.81658 11.6834 7.81658 12.3166 8.20711 12.7071L10 14.5M14 9.5L15.7929 11.2929C16.1834 11.6834 16.1834 12.3166 15.7929 12.7071L14 14.5M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>

        {/* IconBook */}
        <symbol id="sprite-book" viewBox="0 0 24 24">
          <path d="M9 6C8.44772 6 8 6.44772 8 7C8 7.55228 8.44772 8 9 8V6ZM15 8C15.5523 8 16 7.55228 16 7C16 6.44772 15.5523 6 15 6V8ZM9 10C8.44772 10 8 10.4477 8 11C8 11.5523 8.44772 12 9 12V10ZM12 12C12.5523 12 13 11.5523 13 11C13 10.4477 12.5523 10 12 10V12ZM7 4H17V2H7V4ZM18 5V19H20V5H18ZM17 20H7V22H17V20ZM6 19V5H4V19H6ZM7 20C6.44771 20 6 19.5523 6 19H4C4 20.6569 5.34315 22 7 22V20ZM18 19C18 19.5523 17.5523 20 17 20V22C18.6569 22 20 20.6569 20 19H18ZM17 4C17.5523 4 18 4.44772 18 5H20C20 3.34315 18.6569 2 17 2V4ZM7 2C5.34315 2 4 3.34315 4 5H6C6 4.44772 6.44772 4 7 4V2ZM18 12V15H20V12H18ZM17 16H7V18H17V16ZM7 22H10V20H7V22ZM7 16C5.34315 16 4 17.3431 4 19H6C6 18.4477 6.44772 18 7 18V16ZM18 15C18 15.5523 17.5523 16 17 16V18C18.6569 18 20 16.6569 20 15H18ZM9 8H15V6H9V8ZM9 12H12V10H9V12Z" fill="currentColor" />
        </symbol>

        {/* IconChevronBottom */}
        <symbol id="sprite-chevron-bottom" viewBox="0 0 24 24" fill="none">
          <path d="M20 9L13.4142 15.5858C12.6332 16.3668 11.3669 16.3668 10.5858 15.5858L4 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
      </defs>
    </svg>
  );
}
