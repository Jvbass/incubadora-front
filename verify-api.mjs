// Smoke test de la API contra el backend en Docker (C1, C2, C3, C4).
// Requiere el backend corriendo en localhost:8080. Ejecutar: pnpm verify:api
import { execSync } from "node:child_process";

const B = "http://localhost:8080/api";
const j = (r) => r.json();
const code = async (p) => p.then((r) => r.status);

// Lee el código de verificación directamente de la BD (sin SMTP en el MVP, D-14).
const getVerificationCode = (email) =>
  execSync(
    `docker exec incubadora-db mysql -uincubadora_user -pincubadora_pass incubadora_dev -N -e "SELECT code FROM email_verification_codes WHERE email='${email}'"`,
    { encoding: "utf8" }
  )
    .replace(/mysql: \[Warning\].*\n?/, "")
    .trim();

const post = (url, body, token) =>
  fetch(B + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
const patch = (url, token) =>
  fetch(B + url, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
const patchJson = (url, body, token) =>
  fetch(B + url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
const get = (url, token) =>
  fetch(B + url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

const main = async () => {
  console.log("===== C5: emails desechables (RN-15) =====");
  const uniq = Date.now().toString().slice(-6);
  const regDesechable = await post("/auth/register", {
    username: `c5user${uniq}`,
    email: `c5user${uniq}@mailinator.com`,
    password: "Password123",
    firstName: "Caso",
    lastName: `Cinco${uniq}`,
  });
  console.log(
    "REGISTER con mailinator.com (espera 400):",
    regDesechable.status,
    "|",
    (await j(regDesechable)).message
  );
  console.log(
    "REGISTER con subdominio sub.yopmail.com (espera 400):",
    await code(
      post("/auth/register", {
        username: `c5sub${uniq}`,
        email: `c5sub${uniq}@sub.yopmail.com`,
        password: "Password123",
        firstName: "Caso",
        lastName: `CincoSub${uniq}`,
      })
    )
  );

  console.log("\n===== C4: verificación de email =====");
  const email = `c1user${uniq}@example.com`;
  const reg = await post("/auth/register", {
    username: `c1user${uniq}`,
    email,
    password: "Password123",
    firstName: "Caso",
    lastName: `Uno${uniq}`,
  });
  const regBody = await j(reg);
  console.log("REGISTER:", reg.status, "| body:", JSON.stringify(regBody));

  const loginCreds = { username: `c1user${uniq}`, password: "Password123" };
  console.log(
    "LOGIN sin verificar (espera 403):",
    await code(post("/auth/login", loginCreds))
  );
  console.log(
    "VERIFY con código erróneo (espera 409):",
    await code(post("/auth/verify-email", { email, code: "000000" }))
  );
  console.log(
    "RESEND inmediato (espera 409 por cooldown):",
    await code(post("/auth/resend-verification", { email }))
  );

  const realCode = getVerificationCode(email);
  console.log("código leído de la BD:", realCode);
  console.log(
    "VERIFY con código correcto (espera 204):",
    await code(post("/auth/verify-email", { email, code: realCode }))
  );
  console.log(
    "RESEND ya verificado (espera 409):",
    await code(post("/auth/resend-verification", { email }))
  );

  console.log("\n===== C1: visibilidad por defecto =====");
  const loginVerificado = await post("/auth/login", loginCreds);
  console.log("LOGIN tras verificar (espera 200):", loginVerificado.status);
  const { token: t1 } = await j(loginVerificado);
  const perfil = await j(await get("/profile", t1));
  console.log("publicProfile:", perfil.publicProfile, "| slug:", perfil.slug);
  console.log(
    "GET /portfolio/" + perfil.slug + " SIN auth:",
    await code(get("/portfolio/" + perfil.slug))
  );

  console.log("\n===== C6: cambio de username =====");
  console.log(
    "PATCH /auth/me/username SIN token (espera 401/403):",
    await code(patchJson("/auth/me/username", { username: `nuevo${uniq}` }))
  );
  console.log(
    "PATCH username ocupado 'seed-mentor' (espera 409):",
    await code(patchJson("/auth/me/username", { username: "seed-mentor" }, t1))
  );
  console.log(
    "PATCH username inválido 'ab' (espera 400):",
    await code(patchJson("/auth/me/username", { username: "ab" }, t1))
  );
  const cambioResp = await patchJson(
    "/auth/me/username",
    { username: `renombrado${uniq}` },
    t1
  );
  const cambio = await j(cambioResp);
  console.log(
    "PATCH username nuevo (espera 200):",
    cambioResp.status,
    "| username:",
    cambio.username,
    "| token nuevo presente:",
    !!cambio.token
  );
  console.log(
    "GET /profile con token VIEJO (espera 401/403):",
    await code(get("/profile", t1))
  );
  console.log(
    "GET /profile con token NUEVO (espera 200):",
    await code(get("/profile", cambio.token))
  );
  console.log(
    "LOGIN con username nuevo (espera 200):",
    await code(post("/auth/login", { username: `renombrado${uniq}`, password: "Password123" }))
  );

  console.log("\n===== C2/C3: mentorías (archive, publish, paginado, tags) =====");
  const loginResp = await post("/auth/login", {
    username: "seed-mentor",
    password: "Mentor123!",
  });
  const loginBody = await j(loginResp);
  const tm = loginBody.token;
  console.log("login seed-mentor:", loginResp.status, "| token presente:", !!tm);

  const crearResp = await post(
    "/mentorings",
    {
      title: `Mentoria C3 ${uniq}`,
      description: "Mentoria de prueba para verificar tags y paginado del paso C3.",
      specialty: "Testing",
      durationMinutes: 60,
      platform: "zoom",
      timezone: "America/Santiago",
      isFree: true,
      tags: ["React", " typescript ", "react", "Arquitectura"],
    },
    tm
  );
  const crear = await j(crearResp);
  console.log("POST /mentorings:", crearResp.status);
  if (!crearResp.ok) console.log("error body:", JSON.stringify(crear));
  console.log("creada:", crear.slug, "| estado:", crear.mentorshipState, "| tags:", crear.tags);

  console.log("PATCH /archive:", await code(patch(`/mentorings/${crear.slug}/archive`, tm)));
  let det = await j(await get(`/mentorings/${crear.slug}`, tm));
  console.log("estado tras archive:", det.mentorshipState);

  console.log("PATCH /publish:", await code(patch(`/mentorings/${crear.slug}/publish`, tm)));
  det = await j(await get(`/mentorings/${crear.slug}`, tm));
  console.log("estado tras publish:", det.mentorshipState);

  console.log(
    "PATCH /publish con OTRO usuario (espera 403):",
    await code(patch(`/mentorings/${crear.slug}/publish`, cambio.token))
  );

  const paged = await j(await get("/mentorings?page=0&size=5", tm));
  console.log(
    "GET /mentorings paginado -> success:", paged.success,
    "| items:", paged.data?.length,
    "| meta:", JSON.stringify(paged.meta)
  );
  const conTag = await j(await get("/mentorings?page=0&size=5&tag=react", tm));
  console.log(
    "GET /mentorings?tag=react -> items:", conTag.data?.length,
    "| titulos:", conTag.data?.map((m) => m.title)
  );
  const sinTag = await j(await get("/mentorings?page=0&size=5&tag=notexiste", tm));
  console.log("GET /mentorings?tag=notexiste -> items:", sinTag.data?.length);

  console.log("\n===== C8: interacciones de proyecto (mentoría/colaboración) =====");
  const techs = await j(await get("/technologies", cambio.token));
  const proyResp = await post(
    "/projects",
    {
      title: `Proyecto C8 ${uniq}`,
      subtitle: "Proyecto de prueba para ofertas de mentoría y colaboración",
      description: "Proyecto de prueba del paso C8: busca mentor y colaboradores.",
      technologyIds: [techs[0]?.id ?? 1],
      status: "published",
      isCollaborative: true,
      needMentoring: true,
      developmentProgress: 30,
    },
    cambio.token
  );
  const proy = await j(proyResp);
  console.log(
    "POST /projects (dev, published, needMentoring+isCollaborative):",
    proyResp.status,
    "| developerSlug en detalle:",
    proy.developerSlug
  );

  console.log(
    "OFERTA mentoría de seed-mentor (espera 204):",
    await code(post(`/projects/${proy.slug}/mentoring-offers`, { message: "Puedo ayudarte con la arquitectura." }, tm))
  );
  console.log(
    "OFERTA mentoría de un DEV (espera 403 por rol):",
    await code(post(`/projects/${proy.slug}/mentoring-offers`, { message: "yo también" }, cambio.token))
  );
  console.log(
    "COLABORAR de seed-mentor (espera 204):",
    await code(post(`/projects/${proy.slug}/collaboration-requests`, { message: "Sé React y tengo 10h/semana." }, tm))
  );
  console.log(
    "COLABORAR el propio dueño (espera 409):",
    await code(post(`/projects/${proy.slug}/collaboration-requests`, { message: "soy el dueño" }, cambio.token))
  );
  const notifs = await j(await get("/notifications", cambio.token));
  const tiposC8 = (Array.isArray(notifs) ? notifs : [])
    .map((n) => n.notificationType ?? n.type)
    .filter((t) => t === "MENTORING_OFFER" || t === "COLLABORATION_REQUEST");
  console.log(
    "GET /notifications del dueño -> notificaciones C8:",
    tiposC8.length,
    "|",
    tiposC8
  );
};

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
