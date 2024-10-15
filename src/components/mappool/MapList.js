import ModPool from "./Modpool";

/**
 * @param {object} params
 * @param {object} params.maps
 * @param {import('osu-web.js').Beatmap[]} params.maps.nm
 * @param {import('osu-web.js').Beatmap[]} params.maps.hd
 * @param {import('osu-web.js').Beatmap[]} params.maps.hr
 * @param {import('osu-web.js').Beatmap[]} params.maps.dt
 * @param {import('osu-web.js').Beatmap[]} params.maps.other
 * @returns
 */
export default function MapList({ maps }) {
   return (
      <div className="d-flex flex-column gap-4">
         <ModPool mod="NoMod" maps={maps.nm} minCount={2} />
         <ModPool mod="Hidden" maps={maps.hd} minCount={2} />
         <ModPool mod="Hard Rock" maps={maps.hr} minCount={2} />
         <ModPool mod="Double Time" maps={maps.dt} minCount={2} />
         {maps.other.length > 0 && <ModPool mod="Other" maps={maps.other} showMods />}
      </div>
   );
}
