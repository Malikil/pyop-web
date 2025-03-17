import ModPool from "./Modpool";

/**
 * @param {object} props
 * @param {object} props.maps
 * @param {import('osu-web.js').Beatmap[]} props.maps.nm
 * @param {import('osu-web.js').Beatmap[]} props.maps.hd
 * @param {import('osu-web.js').Beatmap[]} props.maps.hr
 * @param {import('osu-web.js').Beatmap[]} props.maps.dt
 * @param {import('osu-web.js').Beatmap[]} props.maps.other
 * @param {object[]} props.mapActions
 * @param {string} props.mapActions.title
 * @param {function} props.mapActions.action
 * @param {function} props.mapActions.condition
 * @param {object} [props.counts]
 * @param {number} [props.counts.nm]
 * @param {number} [props.counts.hd]
 * @param {number} [props.counts.hr]
 * @param {number} [props.counts.dt]
 * @param {number} [props.counts.other]
 */
export default function MapList({ maps, mapActions, counts }) {
   counts = {
      nm: 2,
      hd: 2,
      hr: 2,
      dt: 2,
      other: 0,
      ...counts
   };
   return (
      <div className="d-flex flex-column gap-4">
         <ModPool mod="NoMod" maps={maps.nm} minCount={counts.nm} mapActions={mapActions} />
         <ModPool mod="Hidden" maps={maps.hd} minCount={counts.hd} mapActions={mapActions} />
         <ModPool mod="Hard Rock" maps={maps.hr} minCount={counts.hr} mapActions={mapActions} />
         <ModPool mod="Double Time" maps={maps.dt} minCount={counts.dt} mapActions={mapActions} />
         <ModPool
            mod="Other"
            maps={maps.other}
            minCount={counts.other}
            mapActions={mapActions}
            showMods
         />
      </div>
   );
}
