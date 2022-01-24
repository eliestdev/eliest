package gamelogger


type GamesLogger interface {
	CreateNewCollection(string, string) (error)
	ArchiveCollection(string,string) (error)
	CollectionLength(string,string) (int, error)
	AddGameToCollection(string, string,string) error
}

