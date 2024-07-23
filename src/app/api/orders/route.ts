import {http} from "@/lib/http";
import {get} from "lodash";
import {NextRequest, NextResponse} from "next/server";
import {CustomerOrder} from "./type";

// To handle a GET request to /api
export async function GET() {
  try {
    const {data} = await http.get<{rows: CustomerOrder[]}>(
      "/remap/1.2/entity/customerorder",
      {
        params: {
          expand: "positions.assortment,organization,agent,attributes",
          limit: 100,
          filter:
            "https://api.moysklad.ru/api/remap/1.2/entity/customerorder/metadata/states/b8763991-3c4d-11ef-0a80-0e9b00276b86",
        },
      }
    );

    console.log("data12311: ", data.rows[0]);

    const response = data.rows.map((order) => ({
      externalCode: get(order, "externalCode"),
      moment: get(order, "moment"),
      applicable: get(order, "applicable"),
      vatEnabled: get(order, "vatEnabled"),
      vatIncluded: get(order, "vatIncluded"),
      id: get(order, "id"),
      code: get(order, "name"),
      agent_name: get(order, "agent.name"),
      agent_meta: get(order, "agent.meta"),
      meta: get(order, "meta"),
      organization_meta: get(order, "organization.meta"),
      store: get(order, "store"),
      main_meta: get(data, "meta"),
      agentAccount_meta: get(order, "agent.meta"),
      state_meta: get(order, "state.meta"),
      attributes: get(order, "attributes") || "HELLLOWWW",
      description: get(order, "description"),
      phone: get(order, "agent.phone"),
      // customer_order: get(order, 'cus')
      products: get(order, "positions.rows", []).map((position) => ({
        id: get(position, "id"),
        vat: get(position, "vat"),
        price: get(position, "price"),
        quantity: get(position, "quantity"),
        name: get(position, "assortment.name"),
        code: get(position, "assortment.code"),
        images: get(position, "assortment.images.meta.href"),
        meta: get(position, "assortment.meta"),
        assortment: get(position, "assortment"),
        discount: get(position, "discount"),
      })),
    }));

    return NextResponse.json({data: response}, {status: 200});
  } catch (err) {
    console.log("ERROR: ", err);
    return NextResponse.json({error: JSON.stringify(err)}, {status: 401});
  }
}

export const POST = async (req: NextRequest, res: NextResponse) => {
  const {orderId, ...rest} = await req.json();

  try {
    const isDemandExistData = await http.get(
      `/remap/1.2/entity/customerorder/${orderId}`
    );

    const demandId =
      isDemandExistData?.data?.demands?.[0]?.meta?.href?.split("/")[8];

    console.log("demandID: ", demandId);
    console.log("NEW REQ: ", rest);

    if (demandId) {
      const {data} = await http.put(`/remap/1.2/entity/demand/${demandId}`, {
        ...rest,
      });

      console.log("demandData: ", data);

      return NextResponse.json({
        data,
        message: `Demand with id: ${demandId} has been updated`,
      });
    } else {
      try {
        const {data} = await http.post(`/remap/1.2/entity/demand`, {
          ...rest,
        });
        console.log("DATA: ", data);

        return NextResponse.json({
          data: data,
          message: `Demand with id: ${demandId} has been created`,
        });
      } catch (err: any) {
        console.log("ERROR ON CREATE: ", JSON.stringify(err?.message));
      }
    }
  } catch (err: any) {
    console.log("error: ", err);

    return NextResponse.json(
      {
        error: `Error on checking for demand: ${JSON.stringify(err.message)}`,
      },
      {
        status: 400 as number,
      }
    );
  }

  // const data = http.post(
  //   "https://api.moysklad.ru/api/remap/1.2/entity/customerorder/orderid"
  // );

  // return NextResponse.json({ data: "payload" });
};

export const PUT = async (req: NextRequest) => {
  const reqst = await req.json();

  console.log("reqst: ", reqst);

  try {
    const {data} = await http.put(
      `/remap/1.2/entity/customerorder/${reqst?.id}`,
      reqst
    );

    return NextResponse.json({
      data: data,
      message: "Loaders attached to custom order",
    });
  } catch (err: any) {
    console.log("ERROR: ", err.data);

    return NextResponse.json({error: JSON.stringify(err.data)}, {status: 401});
  }
};
