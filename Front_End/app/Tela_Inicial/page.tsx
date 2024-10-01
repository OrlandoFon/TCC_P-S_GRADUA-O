import React from 'react';
import { TextField, Button } from '@mui/material';
import Link from 'next/link';

function TELA_INICIAL() {
  return (
    <>
      {/* Vídeo de fundo */}
      <video
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          opacity: "0.3",
          height: "100%",
          width: "100%",
          position: "absolute",
          top: "0",
          zIndex: "-1",
          objectFit: "cover"
        }}
        src={require("./video_background/video.mp4")}
        autoPlay
        muted
        loop
      ></video>

      {/* Conteúdo principal */}
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          minHeight: "100vh",
          overflow: "hidden",
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Fundo branco translúcido
          opacity: "0.85"
        }}
      >
        <div
          style={{
            borderRadius: "16px", // Bordas arredondadas
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)", // Sombra suave
            backgroundColor: "white", // Fundo branco
            display: "inline-block",
            padding: "20px", // Mais espaço interno
            maxWidth: "600px",
            width: "100%",
            zIndex: 1, // Colocar acima do vídeo
          }}
        >
          {/* Texto de introdução */}
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <h2 style={{ color: "#7269ef", fontWeight: "bold", marginBottom: "15px" }}>
              DashBoard - Indústria 4.0
            </h2>
            <p
              style={{
                textAlign: "justify",
                color: "#333",
                lineHeight: "1.6",
              }}
            >
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsam amet corporis
              nemo aut culpa dolorum accusantium fugiat consequatur tempore consequuntur quaerat rerum sequi, ea magnam iste earum eos! Rem, veritatis?
            </p>
          </div>

          {/* Formulário de Login */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderTop: "1px dashed #ccc",
              paddingTop: "20px",
            }}
          >
            {/* Campo de Email */}
            <div style={{ marginBottom: "20px" }}>
              <TextField
                id="email"
                label="Email"
                variant="outlined"
                fullWidth
                defaultValue="user@email.com"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>

            {/* Campo de Senha */}
            <div style={{ marginBottom: "20px" }}>
              <TextField
                id="password"
                label="Senha"
                variant="outlined"
                fullWidth
                defaultValue="password"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>

            {/* Botão de Submissão */}
            <div style={{ textAlign: "right" }}>
              <Link href="../Tela_Central">
                <Button
                  variant="contained"
                  color="primary"
                  style={{ backgroundColor: "#7269ef", color: "white", borderRadius: "8px" }}
                >
                  Submeter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          backgroundColor: "#f6f8fb",
          padding: "10px 0",
          textAlign: "center",
          boxShadow: "0px -4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ color: "#333" }}>
          <p>Site - Nome &copy; 2024</p>
        </div>
      </footer>
    </>
  );
}

export default TELA_INICIAL;
