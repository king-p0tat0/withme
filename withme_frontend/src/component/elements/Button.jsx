import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/system";

// NormalButton 스타일 정의
export const NormalButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 16,
  padding: "6px 12px",
  border: "1px solid",
  lineHeight: 1.5,
  backgroundColor: "#79BD9A",
  borderColor: "#79BD9A",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#3B8686",
    borderColor: "#3B8686",
    boxShadow: "none"
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: "#A8DBA8",
    borderColor: "#A8DBA8"
  },
  "&:focus": {
    boxShadow: "0 0 0 0.2rem rgba(121,189,154,.5)"
  }
});

// DeleteButton 스타일 정의
export const DeleteButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 16,
  padding: "6px 12px",
  border: "1px solid",
  lineHeight: 1.5,
  backgroundColor: "#D23C79",
  borderColor: "#D23C79",
  "&:hover": {
    backgroundColor: "#B22258",
    borderColor: "#B22258",
    boxShadow: "none"
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: "#A81E4F",
    borderColor: "#A81E4F"
  },
  "&:focus": {
    boxShadow: "0 0 0 0.2rem rgba(210,60,121,.5)"
  }
});
