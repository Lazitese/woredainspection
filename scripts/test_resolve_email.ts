import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });
async function testResolve() {
  const { resolveLoginEmail } = await import('../src/app/actions/auth');
  console.log("Testing resolveLoginEmail for '+251911000001' with portalRole 'representative':");
  const res1 = await resolveLoginEmail('+251911000001', 'representative');
  console.log("Result for +251911000001:", res1);

  console.log("\nTesting resolveLoginEmail for 'woreda1@akakikality.gov.et' with portalRole 'representative':");
  const res2 = await resolveLoginEmail('woreda1@akakikality.gov.et', 'representative');
  console.log("Result for woreda1@akakikality.gov.et:", res2);

  console.log("\nTesting resolveLoginEmail for 'admin':");
  const res3 = await resolveLoginEmail('admin');
  console.log("Result for admin:", res3);
}

testResolve().catch(console.error);
