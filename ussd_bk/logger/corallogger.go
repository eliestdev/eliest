package logger

import (
	"os"
	"path/filepath"

	"github.com/natefinch/lumberjack"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"lottoshared/logger"
)


func NewCoralZapLogger() *logger.Applogger {
	writerSyncer := getCoralLogWriter()
	encoder := getCoralEncoder()
			
	core := zapcore.NewCore(encoder, writerSyncer, zapcore.DebugLevel)
	l := zap.New(core, zap.AddCaller())
	return &logger.Applogger{
		Log: l.Sugar(),
	}
}


func getCoralLogWriter() zapcore.WriteSyncer {
	cwd := os.Getenv("WorkStation")
	filename := filepath.Join(cwd, "coral.log")
	lumberJackLogger := &lumberjack.Logger{
		Filename:   filename,
		MaxSize:    10,
		MaxBackups: 5,
		MaxAge:     30,
		Compress:   false,
	}
	return zapcore.AddSync(lumberJackLogger)
}

func getCoralEncoder() zapcore.Encoder {
	encoderConfig := zap.NewProductionEncoderConfig()
	encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	encoderConfig.EncodeLevel = zapcore.CapitalLevelEncoder
	return zapcore.NewConsoleEncoder(encoderConfig)
}
