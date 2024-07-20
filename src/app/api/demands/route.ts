import {http} from "@/lib/http";
import {NextResponse} from "next/server";

export const GET = async () => {
  try {
    const {data} = await http.get(`/remap/1.2/entity/demand`, {
      params: {
        filter:
          "state=https://api.moysklad.ru/api/remap/1.2/entity/demand/metadata/states/18cc9c67-466a-11ef-0a80-01a5001bd270",
        expand: "demandpositions",
      },
    });

    const demands = await Promise.all(
      data.rows.map(async (demand: any) => {
        const {data: positionsData} = await http.get(
          `/remap/1.2/entity/demand/${demand.id}/positions`
        );

        console.log("positionsData: ", positionsData.rows[0].assortment);

        const positionIdsArray = positionsData.rows.map((demandPosition: any) =>
          demandPosition?.assortment?.meta?.uuidHref
            ?.split("?")[1]
            .replace("id=", "")
        );

        return {
          [demand?.customerOrder?.meta?.href?.split("/")?.[8]!]:
            positionIdsArray,
        };
      })
    );

    // Merging demands array into a single object
    const mergedDemands = demands.reduce((acc, demand) => {
      const [key, value] = Object.entries(demand)[0];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key] = acc[key].concat(value);
      return acc;
    }, {});

    return NextResponse.json(mergedDemands, {status: 200});
  } catch (err) {
    console.log("ERROR: ", err);
    return NextResponse.json({error: JSON.stringify(err)}, {status: 401});
  }
};
