export const dynamic = "force-dynamic";

export default async function Boom() {
  throw new Error("temporary probe to photograph the error boundary");
}
